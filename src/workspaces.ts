import { findGitRoot } from "./paths";
import fs from "fs";
import path from "path";
import multimatch from "multimatch";
import readYaml from "read-yaml";
import jju from "jju";

const cache = new Map<string, string[]>();

/**
 * Finds the git root, then either process yarn, pnpm workspaces minimatches vs what is checked into git repo
 * @param cwd
 */
export function getAllPackageJsonFiles(cwd: string) {
  if (cache.has(cwd)) {
    return cache.get(cwd);
  }

  const gitRoot = findGitRoot(cwd)!;

  // Rush handling
  if (fs.existsSync(path.join(gitRoot, "rush.json"))) {
    const rushConfig = jju.parse(
      fs.readFileSync(path.join(gitRoot, "rush.json"), "utf-8")
    );
    return rushConfig.projects.map((project: any) =>
      path.join(project.projectFolder, "package.json")
    ) as string[];
  }

  let packagePatterns: string[] = [];
  let packageJsonFiles: string[] = [];

  // Lerna handling
  if (fs.existsSync(path.join(gitRoot, "lerna.json"))) {
    const lernaConfig = jju.parse(
      fs.readFileSync(path.join(gitRoot, "lerna.json"), "utf-8")
    );
    packagePatterns = lernaConfig.packages;
  } else if (fs.existsSync(path.join(gitRoot, "pnpm-workspace.yaml"))) {
    try {
      const workspaces = readYaml.sync(
        path.join(gitRoot, "pnpm-workspace.yaml")
      );

      if (workspaces && workspaces.packages) {
        packagePatterns = workspaces.packages;
      }
    } catch {
      throw new Error("The pnpm-workspace.yaml is not formatted correctly");
    }
  } else {
    // Yarn lists packages in the package.json
    if (!fs.existsSync(path.join(gitRoot, "package.json"))) {
      throw new Error(
        "This tool is meant to be run in a workspace at the git root"
      );
    }

    try {
      const packageJson = JSON.parse(
        fs.readFileSync(path.join(gitRoot, "package.json"), "utf-8")
      );

      if (packageJson.workspaces) {
        const workspaces = packageJson.workspaces;

        if (Array.isArray(workspaces)) {
          packagePatterns = workspaces;
        } else if (workspaces.packages) {
          packagePatterns = workspaces.packages;
        }
      }
    } catch {
      throw new Error(
        "The package.json at the root is not formatted correctly"
      );
    }
  }

  if (packagePatterns.length > 0) {
    packageJsonFiles = multimatch(
      packageJsonFiles.map(path.dirname),
      packagePatterns
    );
  }

  cache.set(cwd, packageJsonFiles);

  return packageJsonFiles;
}

export function _resetCache() {
  cache.clear();
}
