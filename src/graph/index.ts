export * from "./createPackageGraph";
import { PackageInfos } from "../types/PackageInfo";
import { createDependencyMap } from "./createDependencyMap";

/**
 * @deprecated - use createDependencyMap() instead
 *
 * Gets a map that has the package name as key, and its dependencies as values
 */
export function getDependentMap(packages: PackageInfos) {
  return createDependencyMap(packages).dependencies;
}
