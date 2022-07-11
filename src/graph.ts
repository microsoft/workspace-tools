import type { PackageInfos } from "./types/PackageInfo";
import type { DependencyMap } from "./createDependencyMap";
import type { PackageGraph, PackageGraphVisitor } from "./types/PackageGraph";

import { createDependencyMap } from "./createDependencyMap";
import multimatch from "multimatch";

// Reference: https://github.com/pnpm/pnpm/blob/597047fc056dd25b83638a9ab3df0df1c555ee49/packages/filter-workspace-packages/src/parsePackageSelector.ts
export interface PackageGraphScope {
  namePatterns?: string[];
  includeDependencies?: boolean;
  includeDependents?: boolean;
}

export function createPackageGraph(packages: PackageInfos, scope: PackageGraphScope = {}): PackageGraph {
  const dependencyMap = createDependencyMap(packages);

  const packageSet = new Set<string>();
  const edges: PackageGraph["dependencies"] = [];
  const edgeKeys: Set<string> = new Set();

 

  const visitor: PackageGraphVisitor = (pkg, dependencies, dependents) => {
    packageSet.add(pkg);
    
    if (scope.includeDependencies && dependencies) {
      for (const dep of dependencies) {
        const key = edgeKey(pkg, dep);

        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push({ name: pkg, dependency: dep });
        }

        packageSet.add(dep);
      }
    }

    if (scope.includeDependents && dependents) {
      for (const dep of dependents) {
        const key = edgeKey(dep, pkg);

        if (!edgeKeys.has(key)) {
          edgeKeys.add(key);
          edges.push({ name: dep, dependency: pkg });
        }
        
        packageSet.add(dep);
      }
    }
  };

  visitPackageGraph(packages, dependencyMap, visitor, scope);

  return {packages: [...packageSet], dependencies: edges};

  /** calculates a key, for looking up whether an edge is already added */
  function edgeKey(name: string, dependency: string) {
    return `${name}->${dependency}`;
  }
}


function visitPackageGraph(
  packages: PackageInfos,
  dependencyMap: DependencyMap,
  visitor: PackageGraphVisitor,
  scope: PackageGraphScope
) {
  const visited = new Set<string>();
  const packageNames = Object.keys(packages);

  const stack: string[] =
    scope && scope.namePatterns ? multimatch(packageNames, scope.namePatterns) : packageNames;

  while (stack.length > 0) {
    const pkg = stack.pop()!;

    if (visited.has(pkg)) {
      continue;
    }

    const nextPkgs: Set<string> = new Set();
    let dependencies: string[] = [];
    let dependents: string[] = [];

    if (scope?.includeDependencies) {
      dependencies = [...dependencyMap.dependencies.get(pkg) ?? []];
      for (const dep of dependencies) {
        nextPkgs.add(dep);
      }
    }

    if (scope?.includeDependents) {
      dependents = [...dependencyMap.dependents.get(pkg) ??[]];
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
