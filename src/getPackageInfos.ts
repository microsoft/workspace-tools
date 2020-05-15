import fs from "fs";
import { PackageInfos } from "./types/PackageInfo";
import { infoFromPackageJson } from "./infoFromPackageJson";
import { getAllPackageJsonFiles } from "./workspaces/workspaces";

export function getPackageInfos(cwd: string) {
  const packageJsonFiles = getAllPackageJsonFiles(cwd);

  const packageInfos: PackageInfos = {};
  if (packageJsonFiles && packageJsonFiles.length > 0) {
    packageJsonFiles.forEach((packageJsonPath: string) => {
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf-8")
        );
        packageInfos[packageJson.name] = infoFromPackageJson(
          packageJson,
          packageJsonPath
        );
      } catch (e) {
        // Pass, the package.json is invalid
        console.warn(
          `Invalid package.json file detected ${packageJsonPath}: `,
          e
        );
      }
    });
    return packageInfos;
  }

  return {};
}
