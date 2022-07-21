//
// Assorted other git utilities
// (could be split into separate files later if desired)
//

import { git, GitError, GitProcessOutput } from "./git";

export function getUntrackedChanges(cwd: string) {
  try {
    return processGitOutput(git(["ls-files", "--others", "--exclude-standard"], { cwd }));
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
 * Gets all the changes that have not been staged yet
 * @param cwd
 */
export function getUnstagedChanges(cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--name-only", "--relative"], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about unstaged changes`, e);
  }
}

export function getChanges(branch: string, cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--relative", "--name-only", branch + "..."], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about changes`, e);
  }
}

/**
 * Gets all the changes between the branch and the merge-base
 */
export function getBranchChanges(branch: string, cwd: string) {
  return getChangesBetweenRefs(branch, "", [], "", cwd);
}

export function getChangesBetweenRefs(fromRef: string, toRef: string, options: string[], pattern: string, cwd: string) {
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

export function getStagedChanges(cwd: string) {
  try {
    return processGitOutput(git(["--no-pager", "diff", "--relative", "--staged", "--name-only"], { cwd }));
  } catch (e) {
    throw new GitError(`Cannot gather information about staged changes`, e);
  }
}

export function getRecentCommitMessages(branch: string, cwd: string) {
  try {
    const results = git(["log", "--decorate", "--pretty=format:%s", `${branch}..HEAD`], { cwd });

    if (!results.success) {
      return [];
    }

    return results.stdout.split(/\n/).map((line) => line.trim());
  } catch (e) {
    throw new GitError(`Cannot gather information about recent commits`, e);
  }
}

export function getUserEmail(cwd: string) {
  try {
    const results = git(["config", "user.email"], { cwd });

    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot gather information about user.email`, e);
  }
}

export function getBranchName(cwd: string) {
  try {
    const results = git(["rev-parse", "--abbrev-ref", "HEAD"], { cwd });

    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot get branch name`, e);
  }
}

export function getFullBranchRef(branch: string, cwd: string) {
  const showRefResults = git(["show-ref", "--heads", branch], { cwd });

  return showRefResults.success ? showRefResults.stdout.split(" ")[1] : null;
}

export function getShortBranchName(fullBranchRef: string, cwd: string) {
  const showRefResults = git(["name-rev", "--name-only", fullBranchRef], {
    cwd,
  });

  return showRefResults.success ? showRefResults.stdout : null;
}

export function getCurrentHash(cwd: string) {
  try {
    const results = git(["rev-parse", "HEAD"], { cwd });

    return results.success ? results.stdout : null;
  } catch (e) {
    throw new GitError(`Cannot get current git hash`, e);
  }
}

/**
 * Get the commit hash in which the file was first added.
 */
export function getFileAddedHash(filename: string, cwd: string) {
  const results = git(["rev-list", "HEAD", filename], { cwd });

  if (results.success) {
    return results.stdout.trim().split("\n").slice(-1)[0];
  }

  return undefined;
}

export function init(cwd: string, email?: string, username?: string) {
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

export function stage(patterns: string[], cwd: string) {
  try {
    patterns.forEach((pattern) => {
      git(["add", pattern], { cwd });
    });
  } catch (e) {
    throw new GitError(`Cannot stage changes`, e);
  }
}

export function commit(message: string, cwd: string, options: string[] = []) {
  try {
    const commitResults = git(["commit", "-m", message, ...options], { cwd });

    if (!commitResults.success) {
      throw new Error(`Cannot commit changes: ${commitResults.stdout} ${commitResults.stderr}`);
    }
  } catch (e) {
    throw new GitError(`Cannot commit changes`, e);
  }
}

export function stageAndCommit(patterns: string[], message: string, cwd: string, commitOptions: string[] = []) {
  stage(patterns, cwd);
  commit(message, cwd, commitOptions);
}

export function revertLocalChanges(cwd: string) {
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

export function getParentBranch(cwd: string) {
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

export function getRemoteBranch(branch: string, cwd: string) {
  const results = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", `${branch}@\{u\}`], { cwd });

  if (results.success) {
    return results.stdout.trim();
  }

  return null;
}

export function parseRemoteBranch(branch: string) {
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
export function getDefaultBranch(cwd: string) {
  const result = git(["config", "init.defaultBranch"], { cwd });

  // Default to the legacy 'master' for backwards compat and old git clients
  return result.success ? result.stdout.trim() : "master";
}

export function listAllTrackedFiles(patterns: string[], cwd: string) {
  const results = git(["ls-files", ...patterns], { cwd });

  return results.success ? results.stdout.split(/\n/) : [];
}

function processGitOutput(output: GitProcessOutput) {
  if (!output.success) {
    return [];
  }

  return output.stdout
    .split(/\n/)
    .map((line) => line.trim())
    .filter((line) => !!line && !line.includes("node_modules"));
}
