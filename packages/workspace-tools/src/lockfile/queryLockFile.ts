import { nameAtVersion } from "./nameAtVersion";
import { LockDependency, ParsedLock } from "./types";

export function queryLockFile(name: string, versionRange: string, lock: ParsedLock): LockDependency {
  const versionRangeSignature = nameAtVersion(name, versionRange);
  return lock.object[versionRangeSignature];
}
