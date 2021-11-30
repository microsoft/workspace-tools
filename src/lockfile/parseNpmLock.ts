import { ParsedLock, NpmLockFile } from "./types";

export const parseNpmLock = (lock: NpmLockFile): ParsedLock => ({
  object: lock.dependencies ?? {},
  type: "success",
});
