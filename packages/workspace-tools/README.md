# workspace-tools

A collection of tools that are useful in a git-controlled monorepo that is managed by one of these software:

- lerna
- npm workspaces
- pnpm workspaces
- rush
- yarn workspaces

# Environment Variables

## GIT_MAX_BUFFER: git operation maxBuffer

Override this value with "GIT_MAX_BUFFER" environment variable. By default, it is using 500MB (as opposed to the
default node.js maxBuffer of 1MB)

## PREFERRED_WORKSPACE_MANAGER

Sometimes multiple package manager files are checked in. It is necessary to hint to `workspace-tools` which manager
is used: `npm`, `yarn`, `pnpm`, `rush`, or `lerna`

# Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
