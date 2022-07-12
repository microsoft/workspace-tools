import { PackageInfo, PackageInfos } from "../types/PackageInfo";

export interface PackageDependenciesOptions {
  withDevDependencies?: boolean;
}

export function getPackageDependencies(info: PackageInfo, packages: PackageInfos, options: PackageDependenciesOptions = {withDevDependencies: true}): string[] {
  const deps = Object.keys({ ...info.dependencies, ...info.devDependencies });
  return Object.keys(packages).filter((pkg) => deps.includes(pkg));
}
