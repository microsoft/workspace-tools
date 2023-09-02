import path from "path";
import { searchUp } from "./searchUp";

/**
 * Starting from `cwd`, searches up the directory hierarchy for `package.json`.
 */
export function findPackageRoot(cwd: string) {
  const jsonPath = searchUp("package.json", cwd);
  return jsonPath && path.dirname(jsonPath);
}
