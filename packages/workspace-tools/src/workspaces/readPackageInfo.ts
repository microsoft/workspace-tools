import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import type { PackageInfo } from "../types/PackageInfo";
import { infoFromPackageJson } from "../infoFromPackageJson";
import { logVerboseWarning } from "../logging";

/**
 * Read package.json from the given path if it exists.
 * Logs a warning if it doesn't exist, or there's an error reading or parsing it.
 * @returns The package info, or undefined if it doesn't exist or can't be read
 */
export function readPackageInfo(cwd: string): PackageInfo | undefined {
  const packageJsonPath = path.join(cwd, "package.json");
  try {
    if (!fs.existsSync(packageJsonPath)) {
      logVerboseWarning(`File does not exist: ${packageJsonPath}`);
      return undefined;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    return infoFromPackageJson(packageJson, packageJsonPath);
  } catch (e) {
    logVerboseWarning(`Error reading or parsing ${packageJsonPath}: ${(e as Error)?.message || e}`);
  }
}

/**
 * Read package.json from the given path if it exists.
 * Logs a warning if it doesn't exist, or there's an error reading or parsing it.
 * @returns The package info, or undefined if it doesn't exist or can't be read
 */
export async function readPackageInfoAsync(cwd: string): Promise<PackageInfo | undefined> {
  const packageJsonPath = path.join(cwd, "package.json");
  try {
    if (!fs.existsSync(packageJsonPath)) {
      logVerboseWarning(`File does not exist: ${packageJsonPath}`);
      return undefined;
    }

    const packageJson = JSON.parse(await fsPromises.readFile(packageJsonPath, "utf-8"));
    return infoFromPackageJson(packageJson, packageJsonPath);
  } catch (e) {
    logVerboseWarning(`Error reading or parsing ${packageJsonPath}: ${(e as Error)?.message || e}`);
  }
}
