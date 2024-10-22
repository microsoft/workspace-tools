import { PackageInfo } from "../types/PackageInfo";

export interface PackageDependenciesOptions {
  withDevDependencies?: boolean;
  withPeerDependencies?: boolean;
  withOptionalDependencies?: boolean;
}

function isValidDependency(info: PackageInfo, dep: string): boolean {
  // check if the dependency range is specified by an external package like npm: or file:
  const range =
    info.dependencies?.[dep] ||
    info.devDependencies?.[dep] ||
    info.peerDependencies?.[dep] ||
    info.optionalDependencies?.[dep];

  // this case should not happen by this point, but we will handle it anyway
  if (!range) {
    return false;
  }

  return !range.startsWith("npm:") && !range.startsWith("file:");
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

  if (info.optionalDependencies && options.withOptionalDependencies) {
    for (const dep of Object.keys(info.optionalDependencies)) {
      if (dep !== info.name && packages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  const filteredDeps = deps.filter((dep) => isValidDependency(info, dep));

  return filteredDeps;
}
