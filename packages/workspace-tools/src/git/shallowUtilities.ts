import { git } from "./git";

/**
 * Get the shared parent commit(s) of the current HEAD and the given branch.
 * @returns null if the commits are unrelated or not enough history is available to determine.
 */
export function getMergeBase(cwd: string, branch: string): string[] | null {
  const result = git(["merge-base", branch, "HEAD"], { cwd });
  // it appears this can potentially return more than one commit
  return result.success ? result.stdout.trim().split("\n") : null;
}

/**
 * Returns whether the curent repo is shallow.
 */
export function isShallowRepo(cwd: string): boolean {
  const result = git(["rev-parse", "--is-shallow-repository"], { cwd });
  return result.success && result.stdout.trim() === "true";
}

/**
 * For a shallow repo, progressively deepen the fetched history until a shared parent is found
 * between the current HEAD and the given branch.
 * @returns true if a shared parent was found after fetching history
 */
export function fetchToMergeBase(options: { cwd: string; branch: string; deepenBy?: number }): boolean {
  const { cwd, branch, deepenBy = 100 } = options;

  if (getMergeBase(cwd, branch)) {
    return true; // shared parent commit is already available
  }

  // Progressively deepen until all history is fetched or a shared parent is found
  while (isShallowRepo(cwd)) {
    const fetchResult = git(["fetch", `--deepen=${deepenBy}`, "--no-tags"], { cwd });

    const mergeBase = getMergeBase(cwd, branch);
    if (mergeBase) {
      return true;
    }

    if (!fetchResult.success) {
      // some issue with fetching; should probably stop
      return false;
    }
  }
  return false;
}
