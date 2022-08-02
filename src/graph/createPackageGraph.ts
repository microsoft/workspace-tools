import type { PackageInfos } from "../types/PackageInfo";
import type { DependencyMap } from "./createDependencyMap";
import type { PackageGraph, PackageGraphVisitor } from "../types/PackageGraph";

import { createDependencyMap } from "./createDependencyMap";
import multimatch from "multimatch";

// Reference: https://github.com/pnpm/pnpm/blob/597047fc056dd25b83638a9ab3df0df1c555ee49/packages/filter-workspace-packages/src/parsePackageSelector.ts
export interface PackageGraphFilter {
  namePatterns: string[];
  includeDependencies?: boolean;
  includeDependents?: boolean;
  withDevDependencies?: boolean;
  withPeerDependencies?: boolean;
}

export function createPackageGraph(
  packages: PackageInfos,
  filters?: PackageGraphFilter[] | PackageGraphFilter
): PackageGraph {
  /** packageSet is the set of packages being accumulated as the graph is filtered */
  const packageSet = new Set<string>();

  /** edges is the array of package names & its dependency being accumulated as the graph is filtered */
  const edges: PackageGraph["dependencies"] = [];

  const edgeKeys: Set<string> = new Set();
  let dependencyMapWithPeerDevDeps: DependencyMap | undefined = undefined;
  let dependencyMapWithPeerDeps: DependencyMap | undefined = undefined;
  let dependencyMapWithDevDeps: DependencyMap | undefined = undefined;
  let dependencyMapWithoutPeerDevDeps: DependencyMap | undefined = undefined;

  /** a visitor for a single filter,  */
  function visitorForFilter(
    filter: PackageGraphFilter | undefined,
    pkg: string,
    dependencies: string[],
    dependents: string[]
  ) {
    packageSet.add(pkg);

    if (!filter || (filter.includeDependencies && dependencies)) {
      for (const dep of dependencies) {
        const key = edgeKey(pkg, dep);

        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push({ name: pkg, dependency: dep });
        }

        packageSet.add(dep);
      }
    }

    if (!filter || (filter.includeDependents && dependents)) {
      for (const dep of dependents) {
        const key = edgeKey(dep, pkg);

        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push({ name: dep, dependency: pkg });
        }

        packageSet.add(dep);
      }
    }
  }

  if (filters) {
    if (Array.isArray(filters)) {
      for (const filter of filters) {
        const dependencyMap = getDependencyMapForFilter(packages, filter);
        const visitor = visitorForFilter.bind(undefined, filter);
        visitPackageGraph(packages, dependencyMap, visitor, filter);
      }
    } else {
      const filter = filters as PackageGraphFilter;
      const dependencyMap = getDependencyMapForFilter(packages, filter);
      const visitor = visitorForFilter.bind(undefined, filter);
      visitPackageGraph(packages, dependencyMap, visitor, filter);
    }
  } else {
    const visitor = visitorForFilter.bind(undefined, undefined);
    const dependencyMap = getDependencyMapForFilter(packages);
    visitPackageGraph(packages, dependencyMap, visitor);
  }

  return { packages: [...packageSet], dependencies: edges };

  /** calculates a key, for looking up whether an edge is already added */
  function edgeKey(name: string, dependency: string) {
    return `${name}->${dependency}`;
  }

  /** gets the dependencyMap for a filter - with or without devDeps */
  function getDependencyMapForFilter(packages: PackageInfos, filter?: PackageGraphFilter) {
    if (!filter) {
      return createDependencyMap(packages);
    }

    if (filter.withDevDependencies && filter.withPeerDependencies && !dependencyMapWithPeerDevDeps) {
      dependencyMapWithPeerDevDeps = createDependencyMap(packages, {
        withDevDependencies: true,
        withPeerDependencies: true,
      });
    } else if (filter.withDevDependencies && !filter.withPeerDependencies && !dependencyMapWithDevDeps) {
      dependencyMapWithDevDeps = createDependencyMap(packages, {
        withDevDependencies: true,
        withPeerDependencies: false,
      });
    } else if (!filter.withDevDependencies && filter.withPeerDependencies && !dependencyMapWithPeerDeps) {
      dependencyMapWithPeerDeps = createDependencyMap(packages, {
        withDevDependencies: false,
        withPeerDependencies: true,
      });
    } else {
      dependencyMapWithoutPeerDevDeps = createDependencyMap(packages, {
        withDevDependencies: false,
        withPeerDependencies: false,
      });
    }

    return filter.withDevDependencies && filter.withPeerDependencies
      ? dependencyMapWithPeerDevDeps!
      : filter.withDevDependencies
      ? dependencyMapWithDevDeps!
      : filter.withPeerDependencies
      ? dependencyMapWithPeerDeps!
      : dependencyMapWithoutPeerDevDeps!;
  }
}

function visitPackageGraph(
  packages: PackageInfos,
  dependencyMap: DependencyMap,
  visitor: PackageGraphVisitor,
  filter?: PackageGraphFilter
) {
  const visited = new Set<string>();
  const packageNames = Object.keys(packages);

  const stack: string[] = filter ? multimatch(packageNames, filter.namePatterns) : packageNames;

  while (stack.length > 0) {
    const pkg = stack.pop()!;

    if (visited.has(pkg)) {
      continue;
    }

    const nextPkgs: Set<string> = new Set();
    let dependencies: string[] = [];
    let dependents: string[] = [];

    if (!filter || filter.includeDependencies) {
      dependencies = [...(dependencyMap.dependencies.get(pkg) ?? [])];
      for (const dep of dependencies) {
        nextPkgs.add(dep);
      }
    }

    if (!filter || filter.includeDependents) {
      dependents = [...(dependencyMap.dependents.get(pkg) ?? [])];
      for (const dep of dependents) {
        nextPkgs.add(dep);
      }
    }

    visitor(pkg, dependencies, dependents);

    visited.add(pkg);

    if (nextPkgs.size > 0) {
      for (const nextPkg of nextPkgs) {
        stack.push(nextPkg);
      }
    }
  }
}
