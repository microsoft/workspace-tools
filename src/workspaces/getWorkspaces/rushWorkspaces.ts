import findUp from "find-up";
import path from "path";
import jju from 'jju';
import fs from 'fs';

import { WorkspaceInfo } from "../../types/WorkspaceInfo";

export function getRushWorkspaces(cwd: string): WorkspaceInfo {
  try {
    const rushJsonPath = findUp.sync("rush.json", { cwd });
    if (!rushJsonPath) {
      return [];
    }

    const rushConfig = jju.parse(fs.readFileSync(rushJsonPath, 'utf-8'));

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
