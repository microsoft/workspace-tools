import { PackageInfo, PackageInfos } from "../types/PackageInfo";

export interface PackageDependenciesOptions {
  withDevDependencies?: boolean;
  withPeerDependencies?: boolean;
}

export function getPackageDependencies(
  info: PackageInfo,
  packages: Set<string>,
  options: PackageDependenciesOptions = { withDevDependencies: true }
): string[] {
  const deps: string[] = [];

  if (info.dependencies) {
    for (const dep of Object.keys(info.dependencies)) {
      if (dep !== info.name && packages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  if (info.devDependencies && options.withDevDependencies) {
    for (const dep of Object.keys(info.devDependencies)) {
      if (dep !== info.name && packages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  if (info.peerDependencies && options.withPeerDependencies) {
    for (const dep of Object.keys(info.peerDependencies)) {
      if (dep !== info.name && packages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  return deps;
}
