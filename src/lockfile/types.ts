export type Dependencies = { [key in string]: string };

export type LockDependency = {
  version: string;
  dependencies?: Dependencies;
};

export type ParsedLock = {
  type: "success" | "merge" | "conflict";
  object: {
    [key in string]: LockDependency;
  };
};

export interface PnpmLockFile {
  packages: { [name: string]: any };
}
