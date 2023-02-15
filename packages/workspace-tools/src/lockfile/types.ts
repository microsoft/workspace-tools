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

export interface NpmWorkspacesInfo {
  version: string;
  workspaces: { packages: string[] };
}

export interface NpmSymlinkInfo {
  resolved: string; // Where the package is  resolved from.
  link: boolean; // A flag to indicate that this is a symbolic link.
  integrity?: "sha512" | "sha1";
  dev?: boolean;
  optional?: boolean;
  devOptional?: boolean;
  dependencies?: { [key: string]: LockDependency };
}

export interface NpmLockFile {
  name: string;
  version: string;
  lockfileVersion?: 1 | 2 | 3; // 1: v5, v6; 2: backwards compatible v7; 3: non-backwards compatible v7
  requires?: boolean;
  packages?: {
    ""?: NpmWorkspacesInfo; // Monorepo root
  } & { [key: string]: NpmSymlinkInfo | LockDependency };
  dependencies?: { [key: string]: LockDependency };
}

export interface BerryLockFile {
  __metadata: any;
  [key: string]: {
    version: string;
    dependencies: {
      [dependency: string]: string;
    };
  };
}
