import { nameAtVersion } from "./nameAtVersion";
import type { LockDependency, ParsedLock, BerryLockFile } from "./types";

export function parseBerryLock(yaml: BerryLockFile): ParsedLock {
  const results: { [key: string]: LockDependency } = {};

  if (yaml) {
    for (const [key, descriptor] of Object.entries(yaml)) {
      if (key === "__metadata") {
        continue;
      }
    }
  }

  return {
    object: results,
    type: "success",
  };
}
