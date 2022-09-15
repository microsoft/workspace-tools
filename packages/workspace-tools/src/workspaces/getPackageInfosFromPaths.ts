import fs from "fs";
import path from "path";
import { PackageInfos, PackageJson } from "../types/PackageInfo";

export function getPackageInfosFromPaths(packagePaths: string[]): PackageInfos {
  const packageInfos: PackageInfos = {};
  for (const packagePath of packagePaths) {
    const packageJsonPath = path.join(packagePath, "package.json");
    try {
      const packageInfo = {
        packageJsonPath,
        ...(JSON.parse(fs.readFileSync(packageJsonPath, "utf-8")) as PackageJson),
      };
      packageInfos[packageInfo.name] = packageInfo;
    } catch {}
  }
  return packageInfos;
}
