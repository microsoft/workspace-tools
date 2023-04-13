import { PackageInfo } from "./PackageInfo";

/**
 * Array with names, paths, and package.json contents for each package in a workspace.
 *
 * The method name is somewhat misleading due to the double meaning of "workspace", but it's retained
 * for compatibility. "Workspace" here refers to an individual package, in the sense of the `workspaces`
 * package.json config used by npm/yarn (instead of referring to the entire monorepo).
 */
export type WorkspaceInfo = {
  name: string;
  path: string;
  packageJson: PackageInfo;
}[];
