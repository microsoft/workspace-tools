import {
  getBranchChanges,
  getChangesBetweenRefs,
  getDefaultRemoteBranch,
  getStagedChanges,
  getUnstagedChanges,
  getUntrackedChanges,
} from "../git";
import { getPackagesByFiles } from "./getPackagesByFiles";

/**
 * Finds all packages that had been changed between two refs in the repo under cwd,
 * by executing `git diff $fromRef...$toRef`.
 *
 * Note that by default, if a repo-wide file such as the root package.json has changed,
 * all packages are assumed to have changed. (This is highly lage-specific behavior.)
 * Disable by setting `returnAllPackagesOnNoMatch` to `false`.
 *
 * Explanation of the three dots:
 *
 * ```txt
 * git diff [--options] <commit>...<commit> [--] [<path>...]
 *
 *   This form is to view the changes on the branch containing and up to
 *   the second <commit>, starting at a common ancestor of both
 *   <commit>. "git diff A...B" is equivalent to "git diff
 *   $(git-merge-base A B) B". You can omit any one of <commit>, which
 *   has the same effect as using HEAD instead.
 * ```
 *
 * @param ignoreGlobs - glob patterns to ignore
 * @param returnAllPackagesOnNoMatch - if true, will return all packages if no matches are found for any file
 * @returns array of package names that have changed
 */
export function getChangedPackagesBetweenRefs(
  cwd: string,
  fromRef: string,
  toRef: string = "",
  ignoreGlobs: string[] = [],
  returnAllPackagesOnNoMatch: boolean = true
) {
  let changes = [
    ...new Set([
      ...(getUntrackedChanges(cwd) || []),
      ...(getUnstagedChanges(cwd) || []),
      ...(getChangesBetweenRefs(fromRef, toRef, [], "", cwd) || []),
      ...(getStagedChanges(cwd) || []),
    ]),
  ];

  return getPackagesByFiles(cwd, changes, ignoreGlobs, returnAllPackagesOnNoMatch);
}

/**
 * Finds all packages that had been changed in the repo under cwd, by executing
 * `git diff $target...`.
 *
 * Note that by default, if a repo-wide file such as the root package.json has changed,
 * all packages are assumed to have changed. (This is highly lage-specific behavior.)
 * Disable by setting `returnAllPackagesOnNoMatch` to `false`.
 *
 * Explanation of the three dots:
 *
 * ```txt
 * git diff [--options] <commit>...<commit> [--] [<path>...]
 *
 *   This form is to view the changes on the branch containing and up to
 *   the second <commit>, starting at a common ancestor of both
 *   <commit>. "git diff A...B" is equivalent to "git diff
 *   $(git-merge-base A B) B". You can omit any one of <commit>, which
 *   has the same effect as using HEAD instead.
 * ```
 *
 * @param target - the merge-base branch (must have been fetched locally)
 * @param ignoreGlobs - glob patterns to ignore
 * @param returnAllPackagesOnNoMatch - if true, will return all packages if no matches are found for any file
 * @returns array of package names that have changed
 */
export function getChangedPackages(
  cwd: string,
  target: string | undefined,
  ignoreGlobs: string[] = [],
  returnAllPackagesOnNoMatch: boolean = true
) {
  const targetBranch = target || getDefaultRemoteBranch({ cwd });
  let changes = [
    ...new Set([
      ...(getUntrackedChanges(cwd) || []),
      ...(getUnstagedChanges(cwd) || []),
      ...(getBranchChanges(targetBranch, cwd) || []),
      ...(getStagedChanges(cwd) || []),
    ]),
  ];

  return getPackagesByFiles(cwd, changes, ignoreGlobs, returnAllPackagesOnNoMatch);
}
