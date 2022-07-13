import { getPackageDependencies, PackageDependenciesOptions } from "./getPackageDependencies";
import { PackageInfos } from "../types/PackageInfo";

// @internal
export interface DependencyMap {
  dependencies: Map<string, Set<string>>;
  dependents: Map<string, Set<string>>;
}

// @internal
export function createDependencyMap(
  packages: PackageInfos,
  options: PackageDependenciesOptions = { withDevDependencies: true, withPeerDependencies: true}
): DependencyMap {
  const map = {
    dependencies: new Map<string, Set<string>>(),
    dependents: new Map<string, Set<string>>(),
  };

  for (const [pkg, info] of Object.entries(packages)) {
    const deps = getPackageDependencies(info, packages, options);
    for (const dep of deps) {
      if (!map.dependencies.has(pkg)) {
        map.dependencies.set(pkg, new Set());
      }
      map.dependencies.get(pkg)!.add(dep);

      if (!map.dependents.has(dep)) {
        map.dependents.set(dep, new Set());
      }
      map.dependents.get(dep)!.add(pkg);
    }
  }
  return map;
}
