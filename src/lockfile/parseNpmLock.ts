import { nameAtVersion } from "./nameAtVersion";
import { ParsedLock, NpmLockFile, LockDependency } from "./types";

type FormatNpmLock = (
  previousValue: { },
  currentValue: [string, LockDependency],
  currentIndex: number,
  array: [string, LockDependency][]
) => { [x: string]: LockDependency; };

/**
 * formatNpmLock reformats the dependencies object, so the key includes the version, similarly to yarn.lock. For
 * example, `"@microsoft/task-scheduler": { }` will become `"@microsoft/task-scheduler@2.7.1": { }`.
 */
const formatNpmLock: FormatNpmLock = (previousValue, currentValue) => {
  const [key, dependency] = currentValue;
  previousValue[nameAtVersion(key, dependency.version)] = dependency;
  return previousValue;
};

export const parseNpmLock = (lock: NpmLockFile): ParsedLock => {
  const dependencies = Object.entries(lock.dependencies ?? {}).reduce(formatNpmLock, {});

  return {
    object: dependencies,
    type: "success",
  };
};
