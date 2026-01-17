import fs from "fs";
import jju from "jju";
import path from "path";
import { managerFiles } from "./getWorkspaceManagerAndRoot";
import { makeWorkspaceUtilities } from "./makeWorkspaceUtilities";

/** Get project folders from rush.json */
function getRushProjects(params: { root: string }) {
  const { root } = params;
  const rushConfig = jju.parse(fs.readFileSync(path.join(root, managerFiles.rush), "utf-8")) as {
    projects: Array<{ projectFolder: string }>;
  };
  return rushConfig.projects.map((p) => p.projectFolder);
}

export const rushUtilities = makeWorkspaceUtilities("rush", {
  getWorkspacePatterns: getRushProjects,
  getWorkspacePackagePaths: ({ root }) => {
    const projectFolders = getRushProjects({ root });
    return projectFolders.map((folder) => path.join(root, folder));
  },
});
