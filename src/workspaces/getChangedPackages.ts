import {
  getBranchChanges,
  getChangesBetweenRefs,
  getDefaultRemoteBranch,
  getStagedChanges,
  getUnstagedChanges,
  getUntrackedChanges,
} from "../git";
import { getWorkspaces } from "./getWorkspaces";
import { getPackagesByFiles } from "./getPackagesByFiles";

function getChangedPackagesByFiles(cwd: string, files: string[], ignoreGlobs: string[] = []) {
  const workspaceInfo = getWorkspaces(cwd);
  
  const packages = getPackagesByFiles(cwd, files, ignoreGlobs, workspaceInfo);
  if (packages.length > 0) {
    return packages;
  } 

  return workspaceInfo.map((pkg) => pkg.name);
}

/**
 * Finds all packages that had been changed between two refs in the repo under cwd
 *
 * executes a "git diff $fromRef...$toRef" to get changes given a merge-base
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
export function getChangedPackagesBetweenRefs(
  cwd: string,
  fromRef: string,
  toRef: string = "",
  ignoreGlobs: string[] = []
) {
  let changes = [
    ...new Set([
      ...(getUntrackedChanges(cwd) || []),
      ...(getUnstagedChanges(cwd) || []),
      ...(getChangesBetweenRefs(fromRef, toRef, [], "", cwd) || []),
      ...(getStagedChanges(cwd) || []),
    ]),
  ];

  return getChangedPackagesByFiles(cwd, changes, ignoreGlobs);
}

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
export function getChangedPackages(cwd: string, target: string | undefined, ignoreGlobs: string[] = []) {
  const targetBranch = target || getDefaultRemoteBranch(undefined, cwd);
  let changes = [
    ...new Set([
      ...(getUntrackedChanges(cwd) || []),
      ...(getUnstagedChanges(cwd) || []),
      ...(getBranchChanges(targetBranch, cwd) || []),
      ...(getStagedChanges(cwd) || []),
    ]),
  ];
  
  return getChangedPackagesByFiles(cwd, changes, ignoreGlobs);
}

