export interface PackageJson {
  name: string;
  version: string;
  dependencies?: { [dep: string]: string };
  devDependencies?: { [dep: string]: string };
  peerDependencies?: { [dep: string]: string };
  private?: boolean;
  group?: string;
  scripts?: { [scriptName: string]: string };
  repository?: string | { type: string; url: string; directory?: string };
  /** Only allowed in the workspace root package.json */
  workspaces?:
    | {
        packages?: string[];
        nohoist?: string[];
      }
    | string[];
  [key: string]: any;
}

export interface PackageInfo extends PackageJson {
  packageJsonPath: string;
}

export interface PackageInfos {
  [pkgName: string]: PackageInfo;
}
