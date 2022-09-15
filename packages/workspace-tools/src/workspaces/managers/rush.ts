import path from "path";
import jju from "jju";
import fs from "fs";

import { getPackageInfosFromPaths } from "../getPackageInfosFromPaths";
import { PackageInfos } from "../../types/PackageInfo";

export function getRushWorkspacePackages(rushWorkspaceRoot: string): PackageInfos {
  try {
    const rushJsonPath = path.join(rushWorkspaceRoot, "rush.json");

    const rushConfig: { projects: Array<{ projectFolder: string }> } = jju.parse(
      fs.readFileSync(rushJsonPath, "utf-8")
    );
    const root = path.dirname(rushJsonPath);

    return getPackageInfosFromPaths(rushConfig.projects.map((project) => path.join(root, project.projectFolder)));
  } catch {
    return {};
  }
}
