import { findGitRoot } from "./paths";
import fs from "fs";
import path from "path";
import { PackageInfos } from "./types/PackageInfo";
import { infoFromPackageJson } from "./infoFromPackageJson";
import { getAllPackageJsonFiles } from "./workspaces";

export function getPackageInfos(cwd: string) {
  const packageJsonFiles = getAllPackageJsonFiles(cwd);
  const gitRoot = findGitRoot(cwd)!;

  const packageInfos: PackageInfos = {};
  if (packageJsonFiles && packageJsonFiles.length > 0) {
    packageJsonFiles.forEach((packageJsonPath: string) => {
      try {
        const packageJsonFullPath = path.join(gitRoot, packageJsonPath);
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonFullPath, "utf-8")
        );
        packageInfos[packageJson.name] = infoFromPackageJson(
          packageJson,
          packageJsonFullPath
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
