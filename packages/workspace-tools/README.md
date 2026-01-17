# workspace-tools

A collection of utilities that are useful in a git-controlled monorepo managed by one of these tools:

- lerna
- npm workspaces
- pnpm workspaces
- rush
- yarn workspaces

## Environment variables

### GIT_DEBUG

Set to any value to log output for all git commands.

### GIT_MAX_BUFFER

Override the `maxBuffer` value for git processes, for example if the repo is very large. `workspace-tools` uses 500MB by default.

### PREFERRED_WORKSPACE_MANAGER

Sometimes if multiple workspace/monorepo manager files are checked in, it's necessary to hint which manager is used: `npm`, `yarn`, `pnpm`, `rush`, or `lerna`.

### VERBOSE

Log additional output from certain functions.

## Breaking changes

For details of changes in all versions, see the [changelog](https://github.com/microsoft/workspace-tools/blob/main/packages/workspace-tools/CHANGELOG.md). This only lists the most significant breaking API changes.

### 0.41.0

- `getWorkspaces`/`getWorkspaceAsync` has been renamed to `getWorkspaceInfos`/`getWorkspaceInfosAsync`, and the deprecated `WorkspaceInfo` type has been removed (use `WorkspaceInfos`).
- `getWorkspaceRoot` has been renamed to `getWorkspaceManagerRoot`. (`getWorkspaceManagerAndRoot` is now exported too, if you also want to know the manager.)
- Several functions now return `string[] | undefined` instead of returning an empty array on error:
  - `getAllPackageJsonFiles`/`getAllPackageJsonFilesAsync`
  - `getWorkspacePackagePaths`/`getWorkspacePackagePathsAsync`
  - `getWorkspaceInfos`/`getWorkspaceInfosAsync`
- Several functions now have a `manager` param to force using a specific manager. Manager-specific `get___WorkspaceRoot` and `get___Workspaces` have been removed.
  - `getWorkspaceManagerRoot`
  - `findProjectRoot` (falls back to the git root and throws if neither is found)
  - `getWorkspacePackagePaths`/`getWorkspacePackagePathsAsync`
  - `getWorkspacePatterns` (new)
  - `getWorkspaceInfos`/`getWorkspaceInfosAsync`
  - `getCatalogs`
- `listOfWorkspacePackageNames` is removed since it's trivially replaced by `workspaces.map(w => w.name)`.
- Some related files have been moved or renamed internally, so deep imports may be broken. Please check the current top-level API to see if the utility you were deep-importing is now exported.
