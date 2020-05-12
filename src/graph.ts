import { PackageInfos } from "./types/PackageInfo";
import { getInternalDeps } from "./dependencies";

const graphCache = new Map<PackageInfos, [string, string][]>();

export function getPackageGraph(packages: PackageInfos) {
  if (graphCache.has(packages)) {
    return graphCache.get(packages)!;
  }

  const edges: [string, string][] = [];

  for (const [pkg, info] of Object.entries(packages)) {
    const deps = getInternalDeps(info, packages);
    for (const dep of deps) {
      edges.push([dep, pkg]);
    }
  }

  graphCache.set(packages, edges);

  return edges;
}

/**
 * @internal resets the graph cache for internal testing purpose only
 */
export function _resetGraphCache() {
  graphCache.clear();
}
