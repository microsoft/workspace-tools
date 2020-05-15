import { PackageInfo } from "./PackageInfo";

export type WorkspaceInfo = {
  name: string;
  path: string;
  packageJson: PackageInfo;
}[];
