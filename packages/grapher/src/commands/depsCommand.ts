import { getPackageInfos, getTransitiveDependencies, getTransitiveDependents, getWorkspaceRoot } from "workspace-tools";

interface DepsCommandOptions {
  scope?: string[];
}

export function depsCommand(options: DepsCommandOptions): void {
  const root = getWorkspaceRoot(process.cwd());

  if (!root) {
    throw new Error("Could not find workspace root");
  }

  const packageInfos = getPackageInfos(root);

  const dependents = getTransitiveDependents(options.scope ?? [], packageInfos);
  console.log("Dependent Packages:");
  console.log(
    dependents
      .sort()
      .map((d) => `  - ${d}`)
      .join("\n")
  );

  console.log("");

  const dependencies = getTransitiveDependencies(options.scope ?? [], packageInfos);
  console.log("Dependencies of Package:");
  console.log(
    dependencies
      .sort()
      .map((d) => `  - ${d}`)
      .join("\n")
  );
}
