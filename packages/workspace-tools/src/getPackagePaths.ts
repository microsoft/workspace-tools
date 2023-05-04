import path from "path";
import glob, { type Options as GlobOptions } from "fast-glob";
import { isCachingEnabled } from "./isCachingEnabled";

const packagePathsCache: { [root: string]: string[] } = {};
const globOptions: GlobOptions = {
  absolute: true,
  ignore: ["**/node_modules/**", "**/__fixtures__/**"],
  stats: false,
};

/**
 * Given package folder globs (such as those from package.json `workspaces`) and a workspace root
 * directory, get paths to actual package folders.
 */
export function getPackagePaths(root: string, packageGlobs: string[]): string[] {
  if (isCachingEnabled() && packagePathsCache[root]) {
    return packagePathsCache[root];
  }

  packagePathsCache[root] = glob
    .sync(getPackageJsonGlobs(packageGlobs), { cwd: root, ...globOptions })
    .map(getResultPackagePath);

  return packagePathsCache[root];
}

/**
 * Given package folder globs (such as those from package.json `workspaces`) and a workspace root
 * directory, get paths to actual package folders.
 */
export async function getPackagePathsAsync(root: string, packageGlobs: string[]): Promise<string[]> {
  if (isCachingEnabled() && packagePathsCache[root]) {
    return packagePathsCache[root];
  }

  packagePathsCache[root] = (await glob(getPackageJsonGlobs(packageGlobs), { cwd: root, ...globOptions })).map(
    getResultPackagePath
  );

  return packagePathsCache[root];
}

function getPackageJsonGlobs(packageGlobs: string[]) {
  return packageGlobs.map((glob) => path.join(glob, "package.json").replace(/\\/g, "/"));
}

function getResultPackagePath(packageJsonPath: string) {
  const packagePath = path.dirname(packageJsonPath);
  return path.sep === "/" ? packagePath : packagePath.replace(/\//g, path.sep);
}
