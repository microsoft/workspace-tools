import fs from "fs";
import { PackageInfos } from "workspace-tools-types";
import { infoFromPackageJson } from "./infoFromPackageJson";
import { getAllPackageJsonFiles } from "./workspaces/workspaces";

export function getPackageInfos(cwd: string) {
  const packageJsonFiles = getAllPackageJsonFiles(cwd);

  const packageInfos: PackageInfos = {};
  if (packageJsonFiles && packageJsonFiles.length > 0) {
    packageJsonFiles.forEach((packageJsonPath: string) => {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
        packageInfos[packageJson.name] = infoFromPackageJson(packageJson, packageJsonPath);
      } catch (e) {
        if (e instanceof Error) {
          // Pass, the package.json is invalid
          throw new Error(`Invalid package.json file detected ${packageJsonPath}: ${e.message}`);
        } else {
          throw e;
        }
      }
    });
    return packageInfos;
  }

  return {};
}
