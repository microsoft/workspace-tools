# workspace-tools

A collection of tools that are useful in a git-controlled monorepo that is managed by one of these tools:

- lerna
- npm workspaces
- pnpm workspaces
- rush
- yarn workspaces

## Environment Variables

### GIT_DEBUG

Set to any value to log output for all git commands.

### GIT_MAX_BUFFER

Override the `maxBuffer` value for git processes, for example if the repo is very large. `workspace-tools` uses 500MB by default.

### PREFERRED_WORKSPACE_MANAGER

Sometimes if multiple workspace manager files are checked in, it's necessary to hint which manager is used: `npm`, `yarn`, `pnpm`, `rush`, or `lerna`.

### VERBOSE

Log additional output from certain functions.
