import { ParsedLock, NpmLockFile } from "./types";

export const parseNpmLock = (lock: NpmLockFile): ParsedLock => ({
  object: lock.dependendcies ?? {},
  type: "success",
});
