import path from "path";
import { spawnSync } from "child_process";

/**
 * Starting from `cwd`, uses `git rev-parse --show-toplevel` to find the root of the git repo.
 * Throws if `cwd` is not in a Git repository.
 */
export function findGitRoot(cwd: string) {
  const result = spawnSync("git", ["rev-parse", "--show-toplevel"], { cwd });

  if (result.status !== 0) {
    throw new Error(`Directory "${cwd}" is not in a git repository`);
  }

  return path.normalize(result.stdout.toString().trim());
}
