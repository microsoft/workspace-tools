import {
  getBranchChanges,
  getStagedChanges,
  getUnstagedChanges,
  getUntrackedChanges,
} from "../git";
import { getWorkspaces } from "./getWorkspaces";
import multimatch from "multimatch";
import path from "path";

/**
 * Finds all packages that had been changed in the repo under cwd
 *
 * executes a "git diff $Target..." to get changes given a merge-base
 *
 * further explanation with the three dots:
 *
 * > git diff [--options] <commit>...<commit> [--] [<path>...]
 * >
 * >    This form is to view the changes on the branch containing and up to
 * >    the second <commit>, starting at a common ancestor of both
 * >    <commit>. "git diff A...B" is equivalent to "git diff
 * >    $(git-merge-base A B) B". You can omit any one of <commit>, which
 * >    has the same effect as using HEAD instead.
 *
 * @returns string[] of package names that have changed
 */
export function getChangedPackages(
  cwd: string,
  target: string = "origin/master",
  ignoreGlobs: string[] = []
) {
  const workspaceInfo = getWorkspaces(cwd);

  let changes = [
    ...new Set([
      ...(getUntrackedChanges(cwd) || []),
      ...(getUnstagedChanges(cwd) || []),
      ...(getBranchChanges(target, cwd) || []),
      ...(getStagedChanges(cwd) || []),
    ]),
  ];

  const ignoreSet = new Set(multimatch(changes, ignoreGlobs));

  changes = changes.filter((change) => !ignoreSet.has(change));

  const changeSet = new Set<string>();

  for (const change of changes) {
    const found = workspaceInfo.find(
      (pkgPath) =>
        change.indexOf(path.relative(cwd, pkgPath.path).replace(/\\/g, "/")) ===
        0
    );
    if (found) {
      changeSet.add(found.name);
    } else {
      return workspaceInfo.map((pkg) => pkg.name);
    }
  }

  return [...changeSet];
}
