import path from "path";
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
      packageJson = require(packageJsonPath) as PackageInfo;
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
