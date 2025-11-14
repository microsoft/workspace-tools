import { getPackageDependencies, PackageDependenciesOptions } from "./getPackageDependencies";
import type { PackageInfos } from "../types/PackageInfo";

export interface DependencyMap {
  dependencies: Map<string, Set<string>>;
  dependents: Map<string, Set<string>>;
}

export function createDependencyMap(
  packages: PackageInfos,
  options: PackageDependenciesOptions = { withDevDependencies: true, withPeerDependencies: false }
): DependencyMap {
  const map = {
    dependencies: new Map<string, Set<string>>(),
    dependents: new Map<string, Set<string>>(),
  };

  const internalPackages = new Set(Object.keys(packages));

  for (const [pkg, info] of Object.entries(packages)) {
    const deps = getPackageDependencies(info, internalPackages, options);
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
