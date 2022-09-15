import { getTransitiveConsumers, getTransitiveProviders } from "./transitiveDeps";
import { getPackageDependencies } from "../graph/getPackageDependencies";

// Some deprecated functions below for backwards compatibility

/** @deprecated Do not use */
export const getTransitiveDependencies = getTransitiveProviders;

export { getTransitiveProviders };

/** @deprecated Do not use */
export const getTransitiveDependents = getTransitiveConsumers;

export { getTransitiveConsumers };

/** @deprecated Do not use */
export const getInternalDeps = getPackageDependencies;
