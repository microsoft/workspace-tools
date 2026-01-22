import fs from "fs";
import path from "path";
import type { PackageInfo } from "../../types/PackageInfo";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";

type PackageJsonWithWorkspaces = Pick<PackageInfo, "workspaces">;

export const defaultUtilities: WorkspaceUtilities = {
  getWorkspacePatterns: ({ root }) => {
    const packageJsonFile = path.join(root, "package.json");

    let packageJson: PackageJsonWithWorkspaces;
    try {
      packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf-8")) as PackageJsonWithWorkspaces;
    } catch {
      throw new Error(`Could not read or parse ${packageJsonFile}`);
    }

    const { workspaces } = packageJson;
    if (!workspaces) {
      throw new Error(`Could not find "workspaces" in ${packageJsonFile} (expected if this is not a monorepo)`);
    }

    const patterns = Array.isArray(workspaces) ? workspaces : workspaces?.packages;
    if (!patterns) {
      throw new Error(`"workspaces" in ${packageJsonFile} does not define "packages"`);
    }
    return { patterns, type: "pattern" };
  },
};
