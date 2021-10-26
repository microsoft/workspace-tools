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

export interface NpmWorspacesInfo {
  version: "string";
  workspaces: Record<"packages", string[]>;
}

export interface NpmSynlinkInfo {
  resolved: string; // Where the package is  reslved from.
  link: boolean; // A flag to indicate that this is a symbolic link.
  integrity?: 'sha512' | 'sha1';
  dev?: boolean;
  optional?: boolean;
  devOptional?: boolean;
  dependendcies?: { [key in string]: LockDependency; }
}

export interface NpmLockFile {
  name: string;
  version: string;
  lockfileVersion?: number; // 1: v5, v6; 2: backwards compatible v7; 3: non-backwards compatible v7 
  requires?: boolean;
  packages?: {
    ""?: NpmWorspacesInfo, // Monorepo root
  } & Record<string, NpmSynlinkInfo | LockDependency>;
  dependendcies?: { [key in string]: LockDependency; }
}
