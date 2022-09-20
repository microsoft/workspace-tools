//
// Assorted other git utilities
// (could be split into separate files later if desired)
//

import { git, GitError, GitProcessOutput } from "./git";

export interface GetChangesBetweenRefsOptions {
  fromRef: string;
  toRef?: string;
  /** Extra options to pass to `git diff` */
  options?: string[];
  /** Files to include */
  pattern?: string;
  cwd: string;
}

/**
 * Get untracked files in the repository
 * @param cwd Directory to run the command in
 * @returns List of relative paths to untracked files
 */
export function getUntrackedChanges(cwd: string): string[] {
  try {
    return processGitOutput(git(["ls-files", "--others", "--exclude-standard"], { cwd, throwOnError: true }));
  } catch (e) {
    throw new GitError(`Cannot gather information about untracked changes`, e);
  }
}

export function fetchRemote(remote: string, cwd: string) {
  const results = git(["fetch", "--", remote], { cwd });

  if (!results.success) {
    throw new GitError(`Cannot fetch remote "${remote}"`);
  }
}

export function fetchRemoteBranch(remote: string, remoteBranch: string, cwd: string) {
  const results = git(["fetch", "--", remote, remoteBranch], { cwd });

  if (!results.success) {
    throw new GitError(`Cannot fetch branch "${remoteBranch}" from remote "${remote}"`);
  }
}

/**
 * Gets all the changed files that have not been staged yet. Throws if the git command fails.
 * @param cwd Directory to run the command in
 * @returns List of relative paths to files with unstaged changes
 */
export function getUnstagedChanges(cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--name-only", "--relative"], { cwd, throwOnError: true }));
  } catch (e) {
    throw new GitError(`Cannot gather information about unstaged changes`, e);
  }
}

/**
 * Gets all the changed files that have not been staged yet. Throws if the git command fails.
 * @param branch Branch to compare against (WITHOUT remote)
 * @param cwd Directory to run the command in
 * @returns List of relative paths to files with committed changes
 */
export function getChanges(branch: string, cwd: string) {
  try {
    return processGitOutput(
      git(["--no-pager", "diff", "--relative", "--name-only", branch + "..."], { cwd, throwOnError: true })
    );
  } catch (e) {
    throw new GitError(`Cannot gather information about changes`, e);
  }
}

/**
 * Gets all the changes between the branch and the merge-base. Throws if the git command fails.
 * @param branch Branch to compare against (WITHOUT remote)
 * @param cwd Directory to run the command in
 */
export function getBranchChanges(branch: string, cwd: string) {
  return getChangesBetweenRefs({ fromRef: branch, toRef: "", cwd });
}

/**
 * Get relative paths to files that changed between `fromRef` and `toRef` (or between `fromRef` and
 * `HEAD` if `toRef` is not specified). Throws if the git command fails.
 * @returns Relative paths to the changed files
 */
export function getChangesBetweenRefs(options: GetChangesBetweenRefsOptions): string[];
/** @deprecated Use the object param version */
export function getChangesBetweenRefs(
  fromRef: string,
  toRef: string,
  options: string[],
  pattern: string,
  cwd: string
): string[];
export function getChangesBetweenRefs(
  fromRefOrOptions: GetChangesBetweenRefsOptions | string,
  ...args: [string, string[], string, string] | []
): string[] {
  let fromRef: string;
  let toRef: string | undefined;
  let options: string[] | undefined;
  let pattern: string | undefined;
  let cwd: string;

  if (typeof fromRefOrOptions === "string") {
    fromRef = fromRefOrOptions;
    [toRef, options, pattern, cwd] = args as [string, string[], string, string];
  } else {
    ({ fromRef, toRef, cwd, options, pattern } = fromRefOrOptions);
  }

  try {
    return processGitOutput(
      git(
        [
          "--no-pager",
          "diff",
          "--name-only",
          "--relative",
          ...(options || []),
          `${fromRef}...${toRef || ""}`,
          ...(pattern ? ["--", pattern] : []),
        ],
        { cwd, throwOnError: true }
      )
    );
  } catch (e) {
    throw new GitError(`Cannot gather information about change between refs changes (${fromRef} to ${toRef})`, e);
  }
}

/**
 * Gets all the changed files that have been staged but not committed. Throws if the git command fails.
 * @param cwd Directory to run the command in
 * @returns List of relative paths to files with staged changes
 */
export function getStagedChanges(cwd: string) {
  try {
    return processGitOutput(
      git(["--no-pager", "diff", "--relative", "--staged", "--name-only"], { cwd, throwOnError: true })
    );
  } catch (e) {
    throw new GitError(`Cannot gather information about staged changes`, e);
  }
}

/**
 * Gets all the recent commit messages. Throws if the git command fails.
 * @param branch Branch to compare against (WITHOUT remote)
 * @param cwd Directory to run the command in
 * @returns List of relative paths to files with staged changes
 */
export function getRecentCommitMessages(branch: string, cwd: string) {
  try {
    const results = git(["log", "--decorate", "--pretty=format:%s", `${branch}..HEAD`], {
      cwd,
      throwOnError: true,
    });

    return results.stdout
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => !!line);
  } catch (e) {
    throw new GitError(`Cannot gather information about recent commits`, e);
  }
}

export function getUserEmail(cwd: string) {
  try {
    const results = git(["config", "user.email"], { cwd });
    // Non-zero code in this case means the user hasn't set their email yet
    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot gather information about user.email`, e);
  }
}

/**
 * Runs `git rev-parse --abbrev-ref HEAD`. Note that if HEAD is detached, this will return
 * literally `HEAD` instead of the branch name. Throws if the git command fails.
 * @param cwd Directory to run the command in
 */
export function getBranchName(cwd: string) {
  try {
    const results = git(["rev-parse", "--abbrev-ref", "HEAD"], { cwd, throwOnError: true });

    return results.stdout;
  } catch (e) {
    throw new GitError(`Cannot get branch name`, e);
  }
}

export function getFullBranchRef(branch: string, cwd: string) {
  const showRefResults = git(["show-ref", "--heads", branch], { cwd, throwOnError: true });
  return showRefResults.success ? showRefResults.stdout.split(" ")[1] : null;
}

/**
 * @deprecated Deprecated due to lack of usage and unhelpful behavior (if the branch isn't found,
 * it prints an error message and exits 0)
 */
export function getShortBranchName(fullBranchRef: string, cwd: string) {
  const showRefResults = git(["name-rev", "--name-only", fullBranchRef], {
    cwd,
  });

  return showRefResults.success ? showRefResults.stdout : null;
}

/**
 * Get the SHA1 corresponding to HEAD. Throws if the git command fails.
 */
export function getCurrentHash(cwd: string) {
  try {
    const results = git(["rev-parse", "HEAD"], { cwd, throwOnError: true });
    return results.stdout;
  } catch (e) {
    throw new GitError(`Cannot get current git hash`, e);
  }
}

/**
 * Get the commit hash in which the file was first added. Throws if the git command fails.
 */
export function getFileAddedHash(filename: string, cwd: string) {
  // This command exits 0 for untracked or newly added files
  const results = git(["rev-list", "HEAD", filename], { cwd, throwOnError: true });
  return results.stdout.trim().split("\n").slice(-1)[0];
}

/**
 * Initialize a git repo with basic settings. Throws if any git command fails.
 */
export function init(cwd: string, email?: string, username?: string) {
  git(["init"], { cwd });

  const configLines = git(["config", "--list"], { cwd, throwOnError: true }).stdout.split("\n");

  if (!configLines.find((line) => line.includes("user.name"))) {
    if (!username) {
      throw new GitError("must include a username when initializing git repo");
    }
    git(["config", "user.name", username], { cwd, throwOnError: true });
  }

  if (!configLines.find((line) => line.includes("user.email"))) {
    if (!email) {
      throw new Error("must include a email when initializing git repo");
    }
    git(["config", "user.email", email], { cwd, throwOnError: true });
  }
}

/**
 * Stage the given files/patterns. Throws if any git command fails.
 */
export function stage(patterns: string[], cwd: string) {
  try {
    patterns.forEach((pattern) => {
      git(["add", pattern], { cwd, throwOnError: true });
    });
  } catch (e) {
    throw new GitError(`Cannot stage changes`, e);
  }
}

/**
 * Commit changes. Throws if the git command fails.
 */
export function commit(message: string, cwd: string, options: string[] = []) {
  try {
    git(["commit", "-m", message, ...options], { cwd, throwOnError: true });
  } catch (e) {
    throw new GitError(`Cannot commit changes`, e);
  }
}

/**
 * Stage and commit the given files/patterns. Throws if any git command fails.
 */
export function stageAndCommit(patterns: string[], message: string, cwd: string, commitOptions: string[] = []) {
  stage(patterns, cwd);
  commit(message, cwd, commitOptions);
}

/**
 * Revert all local changes. Throws if any git command fails.
 */
export function revertLocalChanges(cwd: string) {
  const stash = `workspace-tools_${new Date().getTime()}`;
  git(["stash", "push", "-u", "-m", stash], { cwd, throwOnError: true });

  const results = git(["stash", "list"], { cwd, throwOnError: true });
  const lines = results.stdout.split("\n");
  const foundLine = lines.find((line) => line.includes(stash));

  if (foundLine) {
    const matched = foundLine.match(/^[^:]+/);
    if (matched) {
      git(["stash", "drop", matched[0]]);
      return true;
    }
  }
}

/**
 * Gets the branch this one is derived from. Throws if any git command fails.
 */
export function getParentBranch(cwd: string) {
  const branchName = getBranchName(cwd);

  if (!branchName || branchName === "HEAD") {
    return null;
  }

  const showBranchResult = git(["show-branch", "-a"], { cwd, throwOnError: true });

  if (showBranchResult.success) {
    const showBranchLines = showBranchResult.stdout.split("\n");
    const parentLine = showBranchLines.find(
      (line) => line.includes("*") && !line.includes(branchName) && !line.includes("publish_")
    );

    const matched = parentLine?.match(/\[(.*)\]/);
    return matched ? matched[1] : null;
  }

  return null;
}

export function getRemoteBranch(branch: string, cwd: string) {
  // Non-zero exit code means the branch hasn't been pushed to a remote yet (which is likely fine)
  const results = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", `${branch}@\{u\}`], { cwd });
  return results.success ? results.stdout.trim() : null;
}

export function parseRemoteBranch(branch: string) {
  const [remote, remoteBranch] = branch.split("/", 2);

  return { remote, remoteBranch };
}

/**
 * Gets the default branch based on `git config init.defaultBranch`, falling back to `master`.
 */
export function getDefaultBranch(cwd: string) {
  const result = git(["config", "init.defaultBranch"], { cwd });

  // Default to the legacy 'master' for backwards compat and old git clients
  // (non-zero exit code here means "not set" which is fine)
  return result.success ? result.stdout.trim() : "master";
}

/**
 * List paths to files/patterns. Throws if the git command fails.
 */
export function listAllTrackedFiles(patterns: string[], cwd: string) {
  const results = git(["ls-files", ...patterns], { cwd, throwOnError: true });

  return results.stdout.split("\n").filter((line) => !!line);
}

function processGitOutput(output: GitProcessOutput) {
  return output.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => !!line && !line.includes("node_modules"));
}
