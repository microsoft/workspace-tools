import fs from "fs";
import path from "path";
import { getPackageInfo } from "../../getPackageInfo";
import type { Catalog, NamedCatalogs } from "../../types/Catalogs";
import { readYaml } from "../../lockfile/readYaml";
import type { WorkspaceUtilities } from "./WorkspaceUtilities";
import { defaultUtilities } from "./default";

export const yarnUtilities: WorkspaceUtilities = {
  getWorkspacePatterns: defaultUtilities.getWorkspacePatterns,

  // See https://yarnpkg.com/features/catalogs
  getCatalogs: ({ root }) => {
    const yarnrcYmlPath = path.join(root, ".yarnrc.yml");
    if (fs.existsSync(yarnrcYmlPath)) {
      const yarnrcYml = readYaml<{ catalog?: Catalog; catalogs?: NamedCatalogs }>(yarnrcYmlPath);
      if (yarnrcYml?.catalog || yarnrcYml?.catalogs) {
        // Yarn v4+ format
        return { default: yarnrcYml.catalog, named: yarnrcYml.catalogs };
      }
    } else {
      // Check for midgard-yarn-strict definition of catalogs in package.json
      const workspaceSettings = getPackageInfo(root)?.workspaces;
      if (
        workspaceSettings &&
        !Array.isArray(workspaceSettings) &&
        (workspaceSettings?.catalog || workspaceSettings?.catalogs)
      ) {
        // This probably handles a catalog named "default" as the default catalog
        const { default: namedDefaultCatalog, ...namedCatalogs } = workspaceSettings.catalogs || {};
        return {
          default: workspaceSettings.catalog || namedDefaultCatalog,
          named: Object.keys(namedCatalogs).length ? namedCatalogs : undefined,
        };
      }
    }
    return undefined;
  },
};
