import type { Catalogs } from "../types/Catalogs";
import { getWorkspaceUtilities } from "./implementations";

/**
 * Get version catalogs, if supported by the manager (only pnpm and yarn v4 as of writing).
 * Returns undefined if no catalogs are present or the manager doesn't support them.
 * @see https://pnpm.io/catalogs
 * @see https://yarnpkg.com/features/catalogs
 */
export function getCatalogs(cwd: string): Catalogs | undefined {
  const utils = getWorkspaceUtilities(cwd);
  return utils?.getCatalogs?.(cwd);
}

const catalogRegex = /^catalog:(.*)$/;

/**
 * Returns true if the version starts with `catalog:`.
 */
export function isCatalogVersion(version: string): boolean {
  return catalogRegex.test(version);
}

/**
 * Given a dependency package name and a version string, if the version starts with `catalog:`,
 * look up the actual version spec from the given catalogs.
 *
 * Throws an error if the version uses `catalog:` but no catalogs are defined, or the version
 * isn't found in the given catalog.
 *
 * Returns undefined if the version doesn't start with `catalog:`.
 * @see https://pnpm.io/catalogs
 * @see https://yarnpkg.com/features/catalogs
 */
export function getCatalogVersion(params: {
  name: string;
  version: string;
  catalogs: Catalogs | undefined;
}): string | undefined {
  const { name, version, catalogs } = params;

  const catalogMatch = version.match(/^catalog:(.*)$/);
  if (!catalogMatch) {
    return undefined;
  }

  if (!catalogs) {
    throw new Error(`Dependency "${name}" uses a catalog version "${version}" but no catalogs are defined.`);
  }

  const catalogName = catalogMatch[1];
  const checkCatalog = catalogName ? catalogs.named?.[catalogName] : catalogs.default;
  const catalogNameStr = catalogName ? `catalogs.${catalogName}` : "the default catalog";

  if (!checkCatalog) {
    throw new Error(`Dependency "${name}" uses a catalog version "${version}" but ${catalogNameStr} is not defined.`);
  }

  const actualVersion = checkCatalog[name];
  if (!actualVersion) {
    throw new Error(
      `Dependency "${name}" uses a catalog version "${version}", but ${catalogNameStr} doesn't define a version for "${name}".`
    );
  }
  return actualVersion;
}
