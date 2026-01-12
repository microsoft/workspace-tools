import { PackageInfo } from "../types/PackageInfo";

export interface PackageDependenciesOptions {
  withDevDependencies?: boolean;
  withPeerDependencies?: boolean;
  withOptionalDependencies?: boolean;
}

/**
 * Verify that `dep`'s version is not specified with `npm:` or `file:` protocol.
 */
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

/**
 * Gets the monorepo package dependencies for a given package (excluding `file:` or `npm:` versions).
 * It only considers `dependencies` unless options specify otherwise.
 *
 * @param info - The package information containing dependencies
 * @param internalPackages - Set of in-repo package names to consider.
 * @param options - Configuration options for which dependency types to include
 * @returns Subset of `packages` that are dependencies of the given package
 */
export function getPackageDependencies(
  info: PackageInfo,
  internalPackages: Set<string>,
  options: PackageDependenciesOptions = { withDevDependencies: true }
): string[] {
  const deps: string[] = [];

  if (info.dependencies) {
    for (const dep of Object.keys(info.dependencies)) {
      if (dep !== info.name && internalPackages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  if (info.devDependencies && options.withDevDependencies) {
    for (const dep of Object.keys(info.devDependencies)) {
      if (dep !== info.name && internalPackages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  if (info.peerDependencies && options.withPeerDependencies) {
    for (const dep of Object.keys(info.peerDependencies)) {
      if (dep !== info.name && internalPackages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  if (info.optionalDependencies && options.withOptionalDependencies) {
    for (const dep of Object.keys(info.optionalDependencies)) {
      if (dep !== info.name && internalPackages.has(dep)) {
        deps.push(dep);
      }
    }
  }

  const filteredDeps = deps.filter((dep) => isValidDependency(info, dep));

  return filteredDeps;
}
