import { getDefaultRemote, GetDefaultRemoteOptions } from "./getDefaultRemote";
import { git } from "./git";
import { getDefaultBranch } from "./gitUtilities";

export type GetDefaultRemoteBranchOptions = GetDefaultRemoteOptions & {
  /** Name of branch to use. If undefined, uses the default branch name (falling back to `master`). */
  branch?: string;
};

/**
 * Gets a reference to `options.branch` or the default branch relative to the default remote.
 * (See {@link getDefaultRemote} for how the default remote is determined.)
 * Throws if `options.cwd` is not in a git repo or there's no package.json at the repo root.
 * @returns A branch reference like `upstream/master` or `origin/master`.
 */
export function getDefaultRemoteBranch(options: GetDefaultRemoteBranchOptions): string;
/**
 * First param: `branch`. Second param: `cwd`. See {@link GetDefaultRemoteBranchOptions} for more info.
 * (This had to be changed to `...args` to avoid a conflict with the object param version.)
 * @deprecated Use the object param version
 */
export function getDefaultRemoteBranch(...args: string[]): string;
export function getDefaultRemoteBranch(...args: (string | GetDefaultRemoteBranchOptions)[]) {
  const [branchOrOptions, argsCwd] = args;
  const options =
    typeof branchOrOptions === "string"
      ? ({ branch: branchOrOptions, cwd: argsCwd } as GetDefaultRemoteBranchOptions)
      : branchOrOptions;
  const { cwd, branch } = options;

  const defaultRemote = getDefaultRemote(options);

  if (branch) {
    return `${defaultRemote}/${branch}`;
  }

  const showRemote = git(["remote", "show", defaultRemote], { cwd });
  let remoteDefaultBranch: string | undefined;

  if (showRemote.success) {
    /**
     * `showRemote.stdout` is something like this:
     *
     * * remote origin
     *   Fetch URL: .../monorepo-upstream
     *   Push  URL: .../monorepo-upstream
     *   HEAD branch: main
     */
    remoteDefaultBranch = showRemote.stdout
      .split(/\n/)
      .find((line) => line.includes("HEAD branch"))
      ?.replace(/^\s*HEAD branch:\s+/, "");
  }

  remoteDefaultBranch ||= getDefaultBranch({ cwd, throwOnError: options.strict });

  return `${defaultRemote}/${remoteDefaultBranch}`;
}
