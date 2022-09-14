import { PackageInfo, PackageInfos } from "../types/PackageInfo";

export interface PackageDependenciesOptions {
  withDevDependencies?: boolean;
  withPeerDependencies?: boolean;
}

export function getPackageDependencies(
  info: PackageInfo,
  packages: PackageInfos,
  options: PackageDependenciesOptions = { withDevDependencies: true }
): string[] {
  const deps = {
    ...info.dependencies,
    ...(options.withDevDependencies && info.devDependencies),
    ...(options.withPeerDependencies && info.peerDependencies),
  };
  return Object.keys(packages).filter((pkg) => !!deps[pkg]);
}
