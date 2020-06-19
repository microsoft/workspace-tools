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

export function getDependentMap(packages: PackageInfos) {
  const graph = getPackageGraph(packages);
  const map = new Map<string, Set<string>>();
  for (const [from, to] of graph) {
    if (!map.has(to)) {
      map.set(to, new Set());
    }

    map.get(to)!.add(from);
  }

  return map;
}

/**
 * for a package graph of a->b->c (where b depends on a), transitive consumers of a are b & c and their consumers (or what are the consequences of a)
 * @param targets
 * @param packages
 */
export function getTransitiveConsumers(
  targets: string[],
  packages: PackageInfos
) {
  const graph = getPackageGraph(packages);
  const pkgQueue: string[] = [...targets];
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

  return [...visited].filter((pkg) => !targets.includes(pkg));
}

/**
 * for a package graph of a->b->c (where b depends on a), transitive providers of c are a & b and their providers (or what is needed to satisfy c)
 * @param targets
 * @param packages
 */
export function getTransitiveProviders(
  targets: string[],
  packages: PackageInfos
) {
  const graph = getPackageGraph(packages);
  const pkgQueue: string[] = [...targets];
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

  return [...visited].filter((pkg) => !targets.includes(pkg));
}

/** @deprecated use `getDownstreamDependencies()` instead */
export const getTransitiveDependencies = getTransitiveConsumers;

export function getInternalDeps(info: PackageInfo, packages: PackageInfos) {
  const deps = Object.keys({ ...info.dependencies, ...info.devDependencies });
  return Object.keys(packages).filter((pkg) => deps.includes(pkg));
}
