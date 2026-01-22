import path from "path";
import { readYaml } from "../../lockfile/readYaml";
import type { Catalog, NamedCatalogs } from "../../types/Catalogs";
import { managerFiles } from "./getWorkspaceManagerAndRoot";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";

type PnpmWorkspaceYaml = {
  packages: string[];
  // Format per https://pnpm.io/catalogs
  catalog?: Catalog;
  catalogs?: NamedCatalogs;
};

function getPnpmWorkspaceYaml(params: { root: string }) {
  const pnpmWorkspacesFile = path.join(params.root, managerFiles.pnpm);
  return readYaml<PnpmWorkspaceYaml>(pnpmWorkspacesFile);
}

export const pnpmUtilities: WorkspaceUtilities = {
  getWorkspacePatterns: (params) => {
    const { packages } = getPnpmWorkspaceYaml(params);
    return packages ? { patterns: packages, type: "pattern" } : undefined;
  },

  // See https://pnpm.io/catalogs
  getCatalogs: (params) => {
    const workspaceYaml = getPnpmWorkspaceYaml(params);
    if (!workspaceYaml.catalog && !workspaceYaml.catalogs) {
      return undefined;
    }
    // pnpm treats catalog: and catalog:default as the same (and errors if both are defined),
    // so treat the catalog named "default" as the default if present.
    const { default: namedDefaultCatalog, ...namedCatalogs } = workspaceYaml.catalogs || {};
    return {
      default: workspaceYaml.catalog || namedDefaultCatalog,
      named: Object.keys(namedCatalogs).length ? namedCatalogs : undefined,
    };
  },
};
