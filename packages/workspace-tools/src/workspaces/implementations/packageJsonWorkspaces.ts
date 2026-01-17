import fs from "fs";
import path from "path";
import type { PackageInfo } from "../../types/PackageInfo";

type PackageJsonWithWorkspaces = Pick<PackageInfo, "workspaces">;

/**
 * Read the monorepo root package.json and get the list of package globs from its `workspaces` property.
 *
 * Throws an error if no workspace setting is found or there's some other issue.
 */
// use object params so it's obvious the root is expected
export function getPackageJsonWorkspacePatterns(params: { root: string }): string[] {
  const { root } = params;
  const packageJsonFile = path.join(root, "package.json");

  let packageJson: PackageJsonWithWorkspaces;
  try {
    packageJson = JSON.parse(fs.readFileSync(packageJsonFile, "utf-8")) as PackageJsonWithWorkspaces;
  } catch {
    throw new Error(`Could not read or parse ${packageJsonFile}`);
  }

  const { workspaces } = packageJson;

  if (Array.isArray(workspaces)) {
    return workspaces;
  }

  if (!workspaces?.packages) {
    throw new Error(`Could not find a workspaces object in ${packageJsonFile} (expected if this is not a monorepo)`);
  }

  return workspaces.packages;
}
