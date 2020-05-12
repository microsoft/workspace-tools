import { PackageInfo } from "./types/PackageInfo";

export function infoFromPackageJson(
  packageJson: {
    name: string;
    version: string;
    dependencies?: {
      [dep: string]: string;
    };
    devDependencies?: {
      [dep: string]: string;
    };
    peerDependencies?: {
      [dep: string]: string;
    };
    private?: boolean;
    pipeline?: any;
    scripts?: any;
  },
  packageJsonPath: string
): PackageInfo {
  return {
    name: packageJson.name!,
    version: packageJson.version,
    packageJsonPath,
    dependencies: packageJson.dependencies,
    devDependencies: packageJson.devDependencies,
    peerDependencies: packageJson.peerDependencies,
    private: packageJson.private !== undefined ? packageJson.private : false,
    pipeline: packageJson.pipeline,
    scripts: packageJson.scripts !== undefined ? packageJson.scripts : {},
  };
}
