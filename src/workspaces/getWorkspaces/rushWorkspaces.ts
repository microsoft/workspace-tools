import findUp from "find-up";
import path from "path";
import { RushConfiguration } from "@microsoft/rush-lib";

import { WorkspaceInfo } from "../../types/WorkspaceInfo";

export function getRushWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const rushJsonPath = findUp.sync("rush.json", { cwd });
    if (!rushJsonPath) {
      return [];
    }

    const rushConfig = RushConfiguration.loadFromConfigurationFile(
      rushJsonPath
    );

    return rushConfig.projects.map((project) => {
      return {
        name: project.packageName,
        path: project.projectFolder,
        packageJson: {
          ...project.packageJson,
          packageJsonPath: path.join(project.projectFolder, "package.json"),
        },
      };
    });
  } catch {
    return [];
  }
}
