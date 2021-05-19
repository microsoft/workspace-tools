// NOTE: never place the import of lockfile implementation here, as it slows down the library as a whole
import path from "path";
import findUp from "find-up";
import fs from "fs-extra";
import { ParsedLock, PnpmLockFile } from "./types";
import readYamlFile from "read-yaml-file";
import { nameAtVersion } from "./nameAtVersion";
import { parsePnpmLock } from "./parsePnpmLock";

const memoization: { [path: string]: ParsedLock } = {};

export async function parseLockFile(packageRoot: string): Promise<ParsedLock> {
  const yarnLockPath = await findUp(["yarn.lock", "common/config/rush/yarn.lock"], { cwd: packageRoot });

  // First, test out whether this works for yarn
  if (yarnLockPath) {
    if (memoization[yarnLockPath]) {
      return memoization[yarnLockPath];
    }

    const parseYarnLock = (await import("@yarnpkg/lockfile")).parse;
    const yarnLock = fs.readFileSync(yarnLockPath).toString();
    const parsed = parseYarnLock(yarnLock);

    memoization[yarnLockPath] = parsed;

    return parsed;
  }

  // Second, test out whether this works for pnpm
  let pnpmLockPath = await findUp(["pnpm-lock.yaml", "common/config/rush/pnpm-lock.yaml"], { cwd: packageRoot });

  if (pnpmLockPath) {
    if (memoization[pnpmLockPath]) {
      return memoization[pnpmLockPath];
    }

    const yaml = await readYamlFile<PnpmLockFile>(pnpmLockPath);
    const parsed = parsePnpmLock(yaml);
    memoization[pnpmLockPath] = parsed;

    return memoization[pnpmLockPath];
  }

  throw new Error("You do not have either yarn.lock nor pnpm-lock.yaml. Please use one of these package managers");
}

export { nameAtVersion };
export { queryLockFile } from "./queryLockFile";
export * from './types';