import fs from "fs";
import jju from "jju";
import path from "path";
import { getPackagePaths } from "../../getPackagePaths";
import { PackageInfos } from "../../types/PackageInfo";
import { getPackageInfosFromPaths } from "../getPackageInfosFromPaths";

export function getLernaWorkspacePackages(lernaWorkspaceRoot: string, ignorePatterns?: string[]): PackageInfos {
  try {
    const lernaJsonPath = path.join(lernaWorkspaceRoot, "lerna.json");

    const lernaConfig = jju.parse(fs.readFileSync(lernaJsonPath, "utf-8"));

    const packagePaths = getPackagePaths(lernaWorkspaceRoot, lernaConfig.packages, ignorePatterns);
    return getPackageInfosFromPaths(packagePaths);
  } catch {
    return {};
  }
}
