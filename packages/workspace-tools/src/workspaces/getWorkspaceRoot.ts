import { getWorkspaceUtilities } from "./implementations";

export function getWorkspaceRoot(cwd: string): string | undefined {
  const impl = getWorkspaceUtilities(cwd);
  return impl?.getWorkspaceRoot(cwd);
}
