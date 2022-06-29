import { PackageInfo, PackageInfos } from "./types/PackageInfo";

export function getInternalDeps(info: PackageInfo, packages: PackageInfos) {
  const deps = Object.keys({ ...info.dependencies, ...info.devDependencies });
  return Object.keys(packages).filter((pkg) => deps.includes(pkg));
}
