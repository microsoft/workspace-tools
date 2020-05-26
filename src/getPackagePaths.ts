import path from "path";
import globby from "globby";

export function getPackagePaths(
  workspacesRoot: string,
  packages: string[]
): string[] {
  const packagePaths = packages.map((glob) => {
    const globbed = globby
      .sync(path.join(glob, "package.json").replace(/\\/g, "/"), {
        cwd: workspacesRoot,
        absolute: true,
        // expandDirectories: false,
        ignore: ["**/node_modules/**"],
      })
      .map((p) => path.dirname(p));

    return globbed;
  });

  /*
   * fast-glob returns unix style path,
   * so we use path.join to align the path with the platform.
   */
  return packagePaths
    .reduce((acc, cur) => {
      return [...acc, ...cur];
    })
    .map((p) => path.join(p));
}
