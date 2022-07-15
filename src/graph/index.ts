export * from "./createPackageGraph";
import { createDependencyMap } from "./createDependencyMap";

// @deprecated - use createDependencyMap() instead
export { createDependencyMap as getDependentMap };
