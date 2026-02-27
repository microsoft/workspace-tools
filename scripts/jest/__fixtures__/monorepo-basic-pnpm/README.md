This fixture is intended to match the other `monorepo-basic-*` fixtures:

- Workspaces: `["individual", "packages/*"]`
- Same basic dependencies at root
- `package-a` depends on `react` and `react-dom` (to introduce a `peerDependency`)

It should use the latest version of `pnpm` (may require changing to a newer Node version if updating the lock file). There should only be one `monorepo-basic-pnpm` fixture unless the way workspaces are specified changes. Lock file changes for different versions of `pnpm` should have separate fixtures.

`pnpm` version to `lockfileVersion` mapping: https://github.com/pnpm/spec/blob/master/lockfile/README.md
