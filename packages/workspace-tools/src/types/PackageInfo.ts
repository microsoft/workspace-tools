export interface PackageInfo {
  name: string;
  packageJsonPath: string;
  version: string;
  dependencies?: { [dep: string]: string };
  devDependencies?: { [dep: string]: string };
  peerDependencies?: { [dep: string]: string };
  optionalDependencies?: { [dep: string]: string };
  private?: boolean;
  group?: string;
  scripts?: { [scriptName: string]: string };
  repository?: string | { type: string; url: string; directory?: string };
  [key: string]: any;
}

export interface PackageInfos {
  [pkgName: string]: PackageInfo;
}
