# @ws-tools/grapher

## Generates a list of dependents and dependencies (internal to the workspace) for a package or packages

For one package

```
npx @ws-tools/grapher deps --scope foo
```

For multiple packages:

```
npx @ws-tools/grapher deps --scope foo --scope bar
```
