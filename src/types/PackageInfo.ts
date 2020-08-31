export interface PackageInfo {
  name: string;
  packageJsonPath: string;
  version: string;
  dependencies?: { [dep: string]: string };
  devDependencies?: { [dep: string]: string };
  peerDependencies?: { [dep: string]: string };
  private?: boolean;
  group?: string;
  scripts?: { [dep: string]: string };
  [key: string]:
    | string
    | boolean
    | string[]
    | { [dep: string]: string }
    | undefined;
}

export interface PackageInfos {
  [pkgName: string]: PackageInfo;
}
