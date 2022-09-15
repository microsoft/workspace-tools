// NOTE: never place the import of lockfile implementation here, as it slows down the library as a whole
import fs from "fs";
import { ParsedLock, PnpmLockFile, NpmLockFile } from "./types";
import { nameAtVersion } from "./nameAtVersion";
import { searchUp } from "workspace-tools-paths";
import { parsePnpmLock } from "./parsePnpmLock";
import { parseNpmLock } from "./parseNpmLock";
import { readYaml } from "./readYaml";

const memoization: { [path: string]: ParsedLock } = {};

export async function parseLockFile(packageRoot: string): Promise<ParsedLock> {
  const yarnLockPath = searchUp(["yarn.lock", "common/config/rush/yarn.lock"], packageRoot);

  // First, test out whether this works for yarn
  if (yarnLockPath) {
    if (memoization[yarnLockPath]) {
      return memoization[yarnLockPath];
    }

    const parseYarnLock = (await import("@yarnpkg/lockfile")).parse;
    const yarnLock = fs.readFileSync(yarnLockPath, "utf-8");
    const parsed = parseYarnLock(yarnLock);

    memoization[yarnLockPath] = parsed;

    return parsed;
  }

  // Second, test out whether this works for pnpm
  let pnpmLockPath = searchUp(["pnpm-lock.yaml", "common/config/rush/pnpm-lock.yaml"], packageRoot);

  if (pnpmLockPath) {
    if (memoization[pnpmLockPath]) {
      return memoization[pnpmLockPath];
    }

    const yaml = readYaml<PnpmLockFile>(pnpmLockPath);
    const parsed = parsePnpmLock(yaml);
    memoization[pnpmLockPath] = parsed;

    return memoization[pnpmLockPath];
  }

  // Third, try for npm workspaces
  let npmLockPath = searchUp("package-lock.json", packageRoot);

  if (npmLockPath) {
    if (memoization[npmLockPath]) {
      return memoization[npmLockPath];
    }

    let npmLockJson;
    try {
      npmLockJson = fs.readFileSync(npmLockPath, "utf-8");
    } catch {
      throw new Error("Couldn’t parse package-lock.json.");
    }

    const npmLock: NpmLockFile = JSON.parse(npmLockJson.toString());

    if (!npmLock?.lockfileVersion || npmLock.lockfileVersion < 2) {
      throw new Error(
        `Your package-lock.json version is not supported: lockfileVersion is ${npmLock.lockfileVersion}. You need npm version 7 or above and package-lock version 2 or above. Please, upgrade npm or choose a different package manager.`
      );
    }

    memoization[npmLockPath] = parseNpmLock(npmLock);
    return memoization[npmLockPath];
  }

  throw new Error(
    "You do not have yarn.lock, pnpm-lock.yaml or package-lock.json. Please use one of these package managers."
  );
}

export { nameAtVersion };
export { queryLockFile } from "./queryLockFile";
export * from "./types";
