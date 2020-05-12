import { PackageInfo, PackageInfos } from "./types/PackageInfo";

const graphCache = new Map<PackageInfos, [string, string][]>();

function getPackageGraph(packages: PackageInfos) {
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

export function getTransitiveDependents(
  scopedPackages: string[],
  packages: PackageInfos
) {
  const graph = getPackageGraph(packages);
  const pkgQueue: string[] = [...scopedPackages];
  const visited = new Set<string>();

  while (pkgQueue.length > 0) {
    const pkg = pkgQueue.shift()!;

    if (!visited.has(pkg)) {
      visited.add(pkg);

      for (const [from, to] of graph) {
        if (to === pkg) {
          pkgQueue.push(from);
        }
      }
    }
  }

  return [...visited].filter((pkg) => !scopedPackages.includes(pkg));
}

export function getTransitiveDependencies(
  scopedPackages: string[],
  packages: PackageInfos
) {
  const graph = getPackageGraph(packages);
  const pkgQueue: string[] = [...scopedPackages];
  const visited = new Set<string>();

  while (pkgQueue.length > 0) {
    const pkg = pkgQueue.shift()!;

    if (!visited.has(pkg)) {
      visited.add(pkg);

      for (const [from, to] of graph) {
        if (from === pkg) {
          pkgQueue.push(to);
        }
      }
    }
  }

  return [...visited].filter((pkg) => !scopedPackages.includes(pkg));
}

export function getInternalDeps(info: PackageInfo, packages: PackageInfos) {
  const deps = Object.keys({ ...info.dependencies, ...info.devDependencies });
  return Object.keys(packages).filter((pkg) => deps.includes(pkg));
}
