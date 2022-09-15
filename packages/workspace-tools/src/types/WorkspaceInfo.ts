import { PackageInfo } from "workspace-tools-types";

export type WorkspaceInfo = {
  name: string;
  path: string;
  packageJson: PackageInfo;
}[];
