//
// Assorted other git utilities
// (could be split into separate files later if desired)
//

import { git, GitError, GitProcessOutput } from "./git";

/**
 * Get a list of files with untracked changes.
 * Throws an error on failure.
 *
 * @returns An array of file paths with untracked changes
 */
export function getUntrackedChanges(cwd: string): string[] {
  try {
    return processGitOutput(git(["ls-files", "--others", "--exclude-standard"], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about untracked changes`, e);
  }
}

/**
 * Fetch from the given remote.
 * Throws an error on failure.
 */
export function fetchRemote(remote: string, cwd: string): void {
  const results = git(["fetch", "--", remote], { cwd });

  if (!results.success) {
    throw new GitError(`Cannot fetch remote "${remote}"`);
  }
}

/**
 * Fetch from the given remote and branch.
 * Throws an error on failure.
 */
export function fetchRemoteBranch(remote: string, remoteBranch: string, cwd: string): void {
  const results = git(["fetch", "--", remote, remoteBranch], { cwd });

  if (!results.success) {
    throw new GitError(`Cannot fetch branch "${remoteBranch}" from remote "${remote}"`);
  }
}

/**
 * Gets file paths with changes that have not been staged yet.
 * Throws an error on failure.
 *
 * @returns An array of relative file paths with unstaged changes
 */
export function getUnstagedChanges(cwd: string): string[] {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--name-only", "--relative"], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about unstaged changes`, e);
  }
}

/**
 * Gets file paths with changes between the current branch and the given branch.
 * Throws an error on failure.
 *
 * @returns An array of relative file paths that have changed
 */
export function getChanges(branch: string, cwd: string): string[] {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--relative", "--name-only", branch + "..."], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about changes`, e);
  }
}

/**
 * Gets file paths with changes between the branch and the merge-base.
 *
 * @returns An array of relative file paths that have changed
 */
export function getBranchChanges(branch: string, cwd: string): string[] {
  return getChangesBetweenRefs(/*from*/ branch, /*to*/ "", /*options*/ [], /*file pattern*/ "", cwd);
}

/**
 * Gets file paths with changes between two git references (commits, branches, tags).
 * Throws an error on failure.
 *
 * @param fromRef - The starting reference
 * @param toRef - The ending reference
 * @param options - Additional git diff options
 * @param pattern - Optional file pattern to filter results
 * @param cwd - The working directory
 * @returns An array of file paths that have changed
 */
export function getChangesBetweenRefs(
  fromRef: string,
  toRef: string,
  options: string[],
  pattern: string,
  cwd: string
): string[] {
  try {
    return processGitOutput(
      git(
        [
          "--no-pager",
          "diff",
          "--name-only",
          "--relative",
          ...options,
          `${fromRef}...${toRef}`,
          ...(pattern ? ["--", pattern] : []),
        ],
        { cwd }
      )
    );
  } catch (e) {
    throw new GitError(`Cannot gather information about change between refs changes (${fromRef} to ${toRef})`, e);
  }
}

/**
 * Gets all files with staged changes (files added to the index).
 * Throws an error on failure.
 *
 * @returns An array of relative file paths that have been staged
 */
export function getStagedChanges(cwd: string): string[] {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--relative", "--staged", "--name-only"], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about staged changes`, e);
  }
}

/**
 * Gets recent commit messages between the specified branch and HEAD.
 * Returns an empty array if the operation fails.
 *
 * @returns An array of commit message strings
 */
export function getRecentCommitMessages(branch: string, cwd: string): string[] {
  try {
    const results = git(["log", "--decorate", "--pretty=format:%s", `${branch}..HEAD`], { cwd });

    if (!results.success) {
      return [];
    }

    return results.stdout
      .split(/\n/)
      .map((line) => line.trim())
      .filter((line) => !!line);
  } catch (e) {
    throw new GitError(`Cannot gather information about recent commits`, e);
  }
}

/**
 * Gets the user email from the git config.
 * @returns The email string if found, null otherwise
 */
export function getUserEmail(cwd: string): string | null {
  try {
    const results = git(["config", "user.email"], { cwd });

    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot gather information about user.email`, e);
  }
}

/**
 * Gets the current branch name.
 * @returns The branch name if successful, null otherwise
 */
export function getBranchName(cwd: string): string | null {
  try {
    const results = git(["rev-parse", "--abbrev-ref", "HEAD"], { cwd });

    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot get branch name`, e);
  }
}

/**
 * Gets the full reference path for a given branch.
 * @param branch - The short branch name (e.g., `branch-name`)
 * @returns The full branch reference (e.g., `refs/heads/branch-name`) if found, null otherwise
 */
export function getFullBranchRef(branch: string, cwd: string): string | null {
  const showRefResults = git(["show-ref", "--heads", branch], { cwd });

  return showRefResults.success ? showRefResults.stdout.split(" ")[1] : null;
}

/**
 * Gets the short branch name from a full branch reference.
 * Note this may not work properly for the current branch.
 * @param fullBranchRef - The full branch reference (e.g., `refs/heads/branch-name`)
 * @returns The short branch name if successful, null otherwise
 */
export function getShortBranchName(fullBranchRef: string, cwd: string): string | null {
  const showRefResults = git(["name-rev", "--name-only", fullBranchRef], {
    cwd,
  });

  return showRefResults.success ? showRefResults.stdout : null;
}

/**
 * Gets the current commit hash (SHA).
 * @returns The hash if successful, null otherwise
 */
export function getCurrentHash(cwd: string): string | null {
  try {
    const results = git(["rev-parse", "HEAD"], { cwd });

    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot get current git hash`, e);
  }
}

/**
 * Get the commit hash in which the file was first added.
 * @returns The commit hash if found, undefined otherwise
 */
export function getFileAddedHash(filename: string, cwd: string): string | undefined {
  const results = git(["rev-list", "--max-count=1", "HEAD", filename], { cwd });

  if (results.success) {
    return results.stdout.trim();
  }

  return undefined;
}

/**
 * Initializes a git repository in the specified directory.
 * Optionally sets user email and username if not already configured.
 * Throws an error if required email or username is not provided and not already configured.
 *
 * @param cwd - The directory to initialize the git repository in
 * @param email - Optional email to set in git config
 * @param username - Optional username to set in git config
 */
export function init(cwd: string, email?: string, username?: string): void {
  git(["init"], { cwd });

  const configLines = git(["config", "--list"], { cwd }).stdout.split("\n");

  if (!configLines.find((line) => line.includes("user.name"))) {
    if (!username) {
      throw new GitError("must include a username when initializing git repo");
    }
    git(["config", "user.name", username], { cwd });
  }

  if (!configLines.find((line) => line.includes("user.email"))) {
    if (!email) {
      throw new Error("must include a email when initializing git repo");
    }
    git(["config", "user.email", email], { cwd });
  }
}

/**
 * Stages files matching the given patterns.
 */
export function stage(patterns: string[], cwd: string): void {
  try {
    patterns.forEach((pattern) => {
      git(["add", pattern], { cwd });
    });
  } catch (e) {
    throw new GitError(`Cannot stage changes`, e);
  }
}

/**
 * Creates a commit with the given message and optional git commit options.
 * Throws an error on failure.
 *
 * @param message - The commit message
 * @param cwd - The working directory
 * @param options - Additional git commit options
 */
export function commit(message: string, cwd: string, options: string[] = []): void {
  try {
    const commitResults = git(["commit", "-m", message, ...options], { cwd });

    if (!commitResults.success) {
      throw new Error(`Cannot commit changes: ${commitResults.stdout} ${commitResults.stderr}`);
    }
  } catch (e) {
    throw new GitError(`Cannot commit changes`, e);
  }
}

/**
 * Stages files matching the given patterns and creates a commit with the specified message.
 * Convenience function that combines `stage()` and `commit()`.
 * Throws an error on commit failure.
 *
 * @param patterns - File patterns to stage
 * @param message - The commit message
 * @param cwd - The working directory
 * @param commitOptions - Additional git commit options
 */
export function stageAndCommit(patterns: string[], message: string, cwd: string, commitOptions: string[] = []): void {
  stage(patterns, cwd);
  commit(message, cwd, commitOptions);
}

/**
 * Reverts all local changes (both staged and unstaged) by stashing them and then dropping the stash.
 * @returns True if the revert was successful, false otherwise
 */
export function revertLocalChanges(cwd: string): boolean {
  const stash = `workspace-tools_${new Date().getTime()}`;
  git(["stash", "push", "-u", "-m", stash], { cwd });
  const results = git(["stash", "list"]);
  if (results.success) {
    const lines = results.stdout.split(/\n/);
    const foundLine = lines.find((line) => line.includes(stash));

    if (foundLine) {
      const matched = foundLine.match(/^[^:]+/);
      if (matched) {
        git(["stash", "drop", matched[0]]);
        return true;
      }
    }
  }

  return false;
}

/**
 * Attempts to determine the parent branch of the current branch using `git show-branch`.
 *
 * @returns The parent branch name if found, null otherwise
 */
export function getParentBranch(cwd: string): string | null {
  const branchName = getBranchName(cwd);

  if (!branchName || branchName === "HEAD") {
    return null;
  }

  const showBranchResult = git(["show-branch", "-a"], { cwd });

  if (showBranchResult.success) {
    const showBranchLines = showBranchResult.stdout.split(/\n/);
    const parentLine = showBranchLines.find(
      (line) => line.includes("*") && !line.includes(branchName) && !line.includes("publish_")
    );

    const matched = parentLine?.match(/\[(.*)\]/);
    return matched ? matched[1] : null;
  }

  return null;
}

/**
 * Gets the remote tracking branch for the specified branch.
 *
 * @returns The remote branch name (e.g., `origin/main`) if found, null otherwise
 */
export function getRemoteBranch(branch: string, cwd: string): string | null {
  const results = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", `${branch}@\{u\}`], { cwd });

  if (results.success) {
    return results.stdout.trim();
  }

  return null;
}

/**
 * Parses a remote branch string (e.g., `origin/main`) into its components.
 *
 * @param branch - The remote branch string to parse (e.g., `origin/main`)
 */
export function parseRemoteBranch(branch: string): {
  /** Remote name, e.g. `origin` */
  remote: string;
  /** Remote branch name, e.g. `main` */
  remoteBranch: string;
} {
  const firstSlashPos = branch.indexOf("/", 0);
  const remote = branch.substring(0, firstSlashPos);
  const remoteBranch = branch.substring(firstSlashPos + 1);

  return {
    remote,
    remoteBranch,
  };
}

/**
 * Gets the default branch based on `git config init.defaultBranch`, falling back to `master`.
 */
export function getDefaultBranch(cwd: string): string {
  const result = git(["config", "init.defaultBranch"], { cwd });

  // Default to the legacy 'master' for backwards compat and old git clients
  return result.success ? result.stdout.trim() : "master";
}

/**
 * Lists all tracked files matching the given patterns.
 *
 * @param patterns - File patterns to match (passed to git ls-files)
 * @param cwd - The working directory
 * @returns An array of file paths, or an empty array if no files are found
 */
export function listAllTrackedFiles(patterns: string[], cwd: string): string[] {
  const results = git(["ls-files", ...patterns], { cwd });

  return results.success && results.stdout.trim() ? results.stdout.trim().split(/\n/) : [];
}

/**
 * Processes git command output by splitting it into lines and filtering out empty lines and `node_modules`.
 *
 * If the command failed with stderr output, an error is thrown.
 *
 * @param output - The git command output to process
 * @returns An array of lines (presumably file paths), or an empty array if the command failed
 * without stderr output.
 */
function processGitOutput(output: GitProcessOutput): string[] {
  if (!output.success) {
    if (output.stderr) {
      throw new Error(output.stderr);
    }
    // TODO: this inconsistency seems maybe not desirable?
    return [];
  }

  return output.stdout
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => !!line && !line.includes("node_modules"));
}
