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

  console.log(dependencyMap)
  const packageSet = new Set<string>();
  const edges: PackageGraph["dependencies"] = [];

  const visitor: PackageGraphVisitor = (pkg, dependencies, dependents) => {
    packageSet.add(pkg);
    
    if (scope.includeDependencies && dependencies) {
      for (const dep of dependencies) {
        edges.push({ name: pkg, dependency: dep });
        packageSet.add(dep);
      }
    }

    if (scope.includeDependents && dependents) {
      for (const dep of dependents) {
        edges.push({ name: dep, dependency: pkg });
        packageSet.add(dep);
      }
    }
  };

  visitPackageGraph(packages, dependencyMap, visitor, scope);

  return {packages: [...packageSet], dependencies: edges};
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

    const nextPkgs: string[] = [];
    let dependencies: string[] = [];
    let dependents: string[] = [];

    if (scope?.includeDependencies) {
      dependencies = [...dependencyMap.dependencies.get(pkg) ?? []];
      nextPkgs.push(...dependencies);
    }

    if (scope?.includeDependents) {
      dependents = [...dependencyMap.dependents.get(pkg) ??[]];
      nextPkgs.push(...dependents);
    }

    visitor(pkg, dependencies, dependents);

    visited.add(pkg);

    if (nextPkgs.length > 0) {
      for (const nextPkg of nextPkgs) {
        stack.push(nextPkg);
      }
    }
  }
}
