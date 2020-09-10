import path from "path";
import fs from "fs";
import { WorkspaceInfo } from "../types/WorkspaceInfo";
import { PackageInfo } from "../types/PackageInfo";

export function getWorkspacePackageInfo(
  workspacePaths: string[]
): WorkspaceInfo {
  if (!workspacePaths) {
    return [];
  }

  return workspacePaths.reduce<WorkspaceInfo>((returnValue, workspacePath) => {
    let packageJson: PackageInfo;
    const packageJsonPath = path.join(workspacePath, "package.json");

    try {
      packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, "utf-8")
      ) as PackageInfo;
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
