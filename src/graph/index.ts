export * from "./createPackageGraph";
import { PackageInfos } from "../types/PackageInfo";
import { createDependencyMap } from "./createDependencyMap";

// @deprecated - use createDependencyMap() instead
export function getDependentMap(packages: PackageInfos) {
  return createDependencyMap(packages).dependents;
}
