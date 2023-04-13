import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { PackageInfo } from "../types/PackageInfo";
import { logVerboseWarning } from "../logging";

export function getWorkspacePackageInfo(packagePaths: string[]): WorkspaceInfo {
  if (!packagePaths) {
    return [];
  }

  return packagePaths.reduce<WorkspaceInfo>((workspacePkgs, workspacePath) => {
    let packageJson: PackageInfo;
    const packageJsonPath = path.join(workspacePath, "package.json");

    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageInfo;
    } catch (err) {
      logVerboseWarning(`Error reading or parsing ${packageJsonPath} while getting workspace package info`, err);
      return workspacePkgs;
    }

    workspacePkgs.push({
      name: packageJson.name,
      path: workspacePath,
      packageJson: {
        ...packageJson,
        packageJsonPath,
      },
    });
    return workspacePkgs;
  }, []);
}

export async function getWorkspacePackageInfoAsync(packagePaths: string[]): Promise<WorkspaceInfo> {
  if (!packagePaths) {
    return [];
  }

  const workspacePkgPromises = packagePaths.map<Promise<WorkspaceInfo[number] | null>>(async (workspacePath) => {
    const packageJsonPath = path.join(workspacePath, "package.json");

    try {
      const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, "utf-8")) as PackageInfo;
      return {
        name: packageJson.name,
        path: workspacePath,
        packageJson: {
          ...packageJson,
          packageJsonPath,
        },
      };
    } catch (err) {
      logVerboseWarning(`Error reading or parsing ${packageJsonPath} while getting workspace package info`, err);
      return null;
    }
  });

  return (await Promise.all(workspacePkgPromises)).flat().filter(Boolean) as WorkspaceInfo;
}
