import { PackageInfo, PackageInfos } from "../types/PackageInfo";

export interface PackageDependenciesOptions {
  withDevDependencies?: boolean;
  withPeerDependencies?: boolean;
}

export function getPackageDependencies(info: PackageInfo, packages: PackageInfos, options: PackageDependenciesOptions = {withDevDependencies: true}): string[] {
  let deps: string[] = [];
  if(options.withDevDependencies && options.withPeerDependencies) {
    deps = Object.keys({ ...info.dependencies, ...info.devDependencies, ...info.peerDependencies });
  } else if (options.withDevDependencies) {
    deps = Object.keys({ ...info.dependencies, ...info.devDependencies });
  } else if (options.withPeerDependencies) {
    deps = Object.keys({ ...info.dependencies, ...info.peerDependencies });
  } else {
    deps = Object.keys({ ...info.dependencies });  
  }
  return Object.keys(packages).filter((pkg) => deps.includes(pkg));
}
