import path from "path";
import glob from "fast-glob";

const packagePathsCache: { [workspacesRoot: string]: string[] } = {};

export function getPackagePaths(workspacesRoot: string, packages: string[], ignorePatterns?: string[]): string[] {
  if (packagePathsCache[workspacesRoot]) {
    return packagePathsCache[workspacesRoot];
  }

  const packagePaths = glob
    .sync(
      packages.map((glob) => path.join(glob, "package.json").replace(/\\/g, "/")),
      {
        cwd: workspacesRoot,
        absolute: true,
        ignore: ["**/node_modules/**", "**/__fixtures__/**"],
        stats: false,
      }
    )
    .map((p) => path.dirname(p));

  if (path.sep === "/") {
    packagePathsCache[workspacesRoot] = packagePaths;
  } else {
    packagePathsCache[workspacesRoot] = packagePaths.map((p) => p.replace(/\//g, path.sep));
  }

  return packagePathsCache[workspacesRoot];
}

export async function getPackagePathsAsync(workspacesRoot: string, packages: string[]): Promise<string[]> {
  if (packagePathsCache[workspacesRoot]) {
    return packagePathsCache[workspacesRoot];
  }

  const packagePaths = (
    await glob(
      packages.map((glob) => path.join(glob, "package.json").replace(/\\/g, "/")),
      {
        cwd: workspacesRoot,
        ignore: ["**/node_modules/**", "**/__fixtures__/**"],
        stats: false,
      }
    )
  ).map((p) => path.join(workspacesRoot, path.dirname(p)));

  if (path.sep === "/") {
    packagePathsCache[workspacesRoot] = packagePaths;
  } else {
    packagePathsCache[workspacesRoot] = packagePaths.map((p) => p.replace(/\//g, path.sep));
  }

  return packagePathsCache[workspacesRoot];
}
