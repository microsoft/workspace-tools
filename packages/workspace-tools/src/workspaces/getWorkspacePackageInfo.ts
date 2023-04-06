import path from "path";
import fs from "fs";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { PackageInfo } from "../types/PackageInfo";

export function getWorkspacePackageInfo(workspacePaths: string[]): WorkspaceInfo {
  if (!workspacePaths) {
    return [];
  }

  return workspacePaths.reduce<WorkspaceInfo>((returnValue, workspacePath) => {
    let packageJson: PackageInfo;
    const packageJsonPath = path.join(workspacePath, "package.json");

    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageInfo;
    } catch {
      return returnValue;
    }

    return [
      ...returnValue,
      {
        name: packageJson.name,
        path: workspacePath,
        packageJson: {
          ...packageJson,
          packageJsonPath,
        },
      },
    ];
  }, []);
}

export async function getWorkspacePackageInfoAsync(workspacePaths: string[]): Promise<WorkspaceInfo> {
  if (!workspacePaths) {
    return [];
  }

  const packageInfoPromises: Promise<{ name: string; path: string; packageJson: PackageInfo } | null>[] =
    workspacePaths.map(async (workspacePath) => {
      let packageJson: PackageInfo;
      const packageJsonPath = path.join(workspacePath, "package.json");

      try {
        packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageInfo;
        return {
          name: packageJson.name,
          path: workspacePath,
          packageJson: {
            ...packageJson,
            packageJsonPath,
          },
        };
      } catch {
        return null;
      }
    });

  return (await Promise.all(packageInfoPromises)).flat().filter(Boolean) as WorkspaceInfo;
}
