import type { PackageInfos } from "./types/PackageInfo";
import type { DependencyMap } from "./createDependencyMap";
import type { PackageGraph, PackageGraphVisitor } from "./types/PackageGraph";

import { createDependencyMap } from "./createDependencyMap";
import multimatch from "multimatch";
const _ = require('lodash'); 

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

  for (let i=0; i < edges.length; i++) {
    for (let j=i+1; j < edges.length; j++) {
      let a = Object(edges[i]);
      let b = Object(edges[j]);
      if(_.isEqual(a, b)) {
        edges.splice(i, 1);
        i--;
        j--;
      }
    }
  };

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

    let directDependents: string[] = [];
    let directDependencies: string[] = [];
    
  while (stack.length > 0) {
    const pkg = stack.pop()!;
    const nextPkgs: string[] = [];
    let dependencies: string[] = [];
    let dependents: string[] = [];
    let namePatterns = scope?.namePatterns;

    if (visited.has(pkg)) {
      continue;
    }


    if (scope?.includeDependencies && scope?.includeDependents && namePatterns != undefined) {
      if (namePatterns.includes(pkg)) {
        directDependencies = [...dependencyMap.dependencies.get(pkg) ?? []];
        directDependents = [...dependencyMap.dependents.get(pkg) ??[]];
        dependencies = directDependencies;
        dependents = directDependents;
        nextPkgs.push(...directDependencies);
        nextPkgs.push(...directDependents);
      }

      if (directDependents.includes(pkg)) {
        dependents = [...dependencyMap.dependents.get(pkg) ??[]];
        nextPkgs.push(...dependents);
      }

      if (directDependencies.includes(pkg)) {
        dependencies = [...dependencyMap.dependencies.get(pkg) ?? []];
        nextPkgs.push(...dependencies);
      }
    }

    else if (scope?.includeDependencies) {
      dependencies = [...dependencyMap.dependencies.get(pkg) ?? []];
      nextPkgs.push(...dependencies);
    }

    else if (scope?.includeDependents) {
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
