import type { Catalogs } from "../types/Catalogs";
import { getWorkspaceUtilities } from "./implementations";

/**
 * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
 * Returns undefined if no catalogs are present or the manager doesn't support them.
 * @see https://pnpm.io/catalogs
 * @see https://yarnpkg.com/features/catalogs
 * @param cwd - Current working directory. It will search up from here to find the root, with caching.
 */
export function getCatalogs(cwd: string): Catalogs | undefined {
  const utils = getWorkspaceUtilities(cwd);
  return utils?.getCatalogs?.(cwd);
}

const catalogPrefix = "catalog:";

/**
 * Returns true if the version starts with `catalog:`.
 */
export function isCatalogVersion(version: string): boolean {
  return version.startsWith(catalogPrefix);
}

/**
 * Given a dependency package name and a version spec string, if the version starts with `catalog:`,
 * look up the actual version spec (not the final resolved version) from the given catalogs.
 *
 * Throws an error if there's anything invalid about the catalog spec (no catalogs defined,
 * no matching catalog, catalog doesn't contain `name`, recursive catalog version).
 *
 * Returns undefined if the version doesn't start with `catalog:`.
 * @see https://pnpm.io/catalogs
 * @see https://yarnpkg.com/features/catalogs
 *
 * @param name - Dependency package name
 * @param version - Dependency version spec, e.g. `catalog:my-catalog` or `catalog:`,
 * or some non-catalog spec like `^1.2.3`
 * @returns Actual version spec from the catalog, or undefined if not a catalog version
 */
export function getCatalogVersion(params: {
  name: string;
  version: string;
  catalogs: Catalogs | undefined;
}): string | undefined {
  const { name, version, catalogs } = params;

  if (!isCatalogVersion(version)) {
    return undefined;
  }

  if (!catalogs) {
    throw new Error(`Dependency "${name}" uses a catalog version "${version}" but no catalogs are defined.`);
  }

  const catalogName = version.slice(catalogPrefix.length);
  // If there's no name specified after "catalog:", use the default catalog.
  // Otherwise use the named catalog.
  const checkCatalog = catalogName ? catalogs.named?.[catalogName] : catalogs.default;
  const catalogNameStr = catalogName ? `catalogs.${catalogName}` : "the default catalog";

  if (!checkCatalog) {
    throw new Error(`Dependency "${name}" uses a catalog version "${version}" but ${catalogNameStr} is not defined.`);
  }

  const actualSpec = checkCatalog[name];
  if (!actualSpec) {
    throw new Error(
      `Dependency "${name}" uses a catalog version "${version}", but ${catalogNameStr} doesn't define a version for "${name}".`
    );
  }

  if (isCatalogVersion(actualSpec)) {
    throw new Error(
      `Dependency "${name}" resolves to a recursive catalog version "${actualSpec}", which is not supported.`
    );
  }

  return actualSpec;
}
