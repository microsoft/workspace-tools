// NOTE: never place the import of lockfile implementation here, as it slows down the library as a whole
import path from "path";
import findUp from "find-up";
import fs from "fs-extra";

export type Dependencies = { [key in string]: string };

export type LockDependency = {
  version: string;
  dependencies?: Dependencies;
};

export type ParsedLock = {
  type: "success" | "merge" | "conflict";
  object: {
    [key in string]: LockDependency;
  };
};

export function nameAtVersion(name: string, version: string): string {
  return `${name}@${version}`;
}

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

    const readWantedLockfile = (await import("@pnpm/lockfile-file")).readWantedLockfile;
    const parsed = await readWantedLockfile(path.dirname(pnpmLockPath), {
      ignoreIncompatible: true,
    });

    const object: {
      [key in string]: LockDependency;
    } = {};

    if (parsed && parsed.packages) {
      for (const [pkgSpec, snapshot] of Object.entries(parsed.packages)) {
        // TODO: handle file:foo.tgz syntax (rush uses this for internal package links)
        const specParts = pkgSpec.split(/\//);
        const name = specParts.length > 3 ? `${specParts[1]}/${specParts[2]}` : specParts[1];
        const version = specParts.length > 3 ? specParts[3] : specParts[2];

        object[nameAtVersion(name, version)] = {
          version,
          dependencies: snapshot.dependencies,
        };
      }
    }

    memoization[pnpmLockPath] = { object, type: "success" };

    return memoization[pnpmLockPath];
  }

  throw new Error("You do not have either yarn.lock nor pnpm-lock.yaml. Please use one of these package managers");
}

export function queryLockFile(name: string, versionRange: string, lock: ParsedLock): LockDependency {
  const versionRangeSignature = nameAtVersion(name, versionRange);
  return lock.object[versionRangeSignature];
}
