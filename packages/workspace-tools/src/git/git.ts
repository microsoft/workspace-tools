//
// Basic git wrappers
//

import { SpawnSyncReturns } from "child_process";
import { spawnSync, SpawnSyncOptions } from "child_process";

export class GitError extends Error {
  public originalError: unknown;
  constructor(message: string, originalError?: unknown) {
    if (originalError instanceof Error) {
      super(`${message}: ${originalError.message}`);
    } else {
      super(message);
    }
    this.originalError = originalError;
  }
}

/**
 * A global maxBuffer override for all git operations.
 * Bumps up the default to 500MB instead of 1MB.
 * Override this value with the `GIT_MAX_BUFFER` environment variable.
 */
const defaultMaxBuffer = process.env.GIT_MAX_BUFFER ? parseInt(process.env.GIT_MAX_BUFFER) : 500 * 1024 * 1024;

const isDebug = !!process.env.GIT_DEBUG;

export type GitProcessOutput = {
  stderr: string;
  stdout: string;
  success: boolean;
} & Omit<SpawnSyncReturns<string | Buffer>, "stdout" | "stderr">;

/** Observes the git operations called from `git()` or `gitFailFast()` */
export type GitObserver = (args: string[], output: GitProcessOutput) => void;
const observers: GitObserver[] = [];
let observing: boolean;

/**
 * Adds an observer for the git operations, e.g. for testing
 * @returns a function to remove the observer
 */
export function addGitObserver(observer: GitObserver) {
  observers.push(observer);
  return () => removeGitObserver(observer);
}

/** Clear all git observers */
export function clearGitObservers() {
  observers.splice(0, observers.length);
}

/** Remove a git observer */
function removeGitObserver(observer: GitObserver) {
  const index = observers.indexOf(observer);
  if (index > -1) {
    observers.splice(index, 1);
  }
}

/**
 * Runs git command - use this for read-only commands.
 * `gitFailFast` is recommended for commands that make changes to the filesystem.
 *
 * The caller is responsible for validating the input.
 * `shell` will always be set to false.
 */
export function git(args: string[], options?: SpawnSyncOptions): GitProcessOutput {
  isDebug && console.log(`git ${args.join(" ")}`);
  if (args.some((arg) => arg.startsWith("--upload-pack"))) {
    // This is a security issue and not needed for any expected usage of this library.
    throw new GitError("git command contains --upload-pack, which is not allowed: " + args.join(" "));
  }

  const results = spawnSync("git", args, { maxBuffer: defaultMaxBuffer, ...options, shell: false });

  const output: GitProcessOutput = {
    ...results,
    // these may be undefined if stdio: inherit is set
    stderr: (results.stderr || "").toString().trimEnd(),
    stdout: (results.stdout || "").toString().trimEnd(),
    success: results.status === 0,
  };

  if (isDebug) {
    console.log("exited with code " + results.status);
    output.stdout && console.log("git stdout:\n", output.stdout);
    output.stderr && console.warn("git stderr:\n", output.stderr);
  }

  // notify observers, flipping the observing bit to prevent infinite loops
  if (!observing) {
    observing = true;
    for (const observer of observers) {
      observer(args, output);
    }
    observing = false;
  }

  return output;
}

/**
 * Runs git command and throws an error if it fails.
 * Use this for commands that make changes to the filesystem.
 *
 * The caller is responsible for validating the input.
 * `shell` will always be set to false.
 */
export function gitFailFast(args: string[], options?: SpawnSyncOptions & { noExitCode?: boolean }) {
  const gitResult = git(args, options);
  if (!gitResult.success) {
    if (!options?.noExitCode) {
      process.exitCode = 1;
    }

    throw new GitError(`CRITICAL ERROR: running git command: git ${args.join(" ")}!
    ${gitResult.stdout?.toString().trimEnd()}
    ${gitResult.stderr?.toString().trimEnd()}`);
  }
}
