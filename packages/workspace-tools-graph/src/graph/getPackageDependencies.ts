import { PackageInfo, PackageInfos } from "workspace-tools-types";

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
