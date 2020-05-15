export interface PackageInfo {
  name: string;
  packageJsonPath: string;
  version: string;
  dependencies?: { [dep: string]: string };
  devDependencies?: { [dep: string]: string };
  peerDependencies?: { [dep: string]: string };
  private?: boolean;
  group?: string;
  pipeline?: { [dep: string]: string[] };
  scripts?: { [dep: string]: string };
}

export interface PackageInfos {
  [pkgName: string]: PackageInfo;
}
