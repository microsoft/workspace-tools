/** Contents of `package.json`, plus the `packageJsonPath` */
export interface PackageInfo {
  /** Absolute path to this package.json file */
  packageJsonPath: string;
  name: string;
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

/** Mapping from package name to info (`package.json`) for packages within a monorepo. */
export interface PackageInfos {
  [pkgName: string]: PackageInfo;
}
