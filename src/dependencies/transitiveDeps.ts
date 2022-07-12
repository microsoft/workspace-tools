import { PackageInfos } from "../types/PackageInfo";
import { getPackageDependencies } from "../graph/getPackageDependencies";

const graphCache = new Map<string, [string | null, string][]>();

function memoizedKey(packages: PackageInfos, scope: string[] = []) {
  return JSON.stringify({ packages, scope });
}

function getPackageGraph(packages: PackageInfos, scope: string[] = []) {
  const key = memoizedKey(packages, scope);

  if (graphCache.has(key)) {
    return graphCache.get(key)!;
  }

  const edges: [string | null, string][] = [];

  const visited = new Set<string>();
  const stack: string[] = scope.length > 0 ? [...scope] : Object.keys(packages);

  while (stack.length > 0) {
    const pkg = stack.pop()!;

    if (visited.has(pkg)) {
      continue;
    }

    visited.add(pkg);

    const info = packages[pkg];
    const deps = getPackageDependencies(info, packages);

    if (deps.length > 0) {
      for (const dep of deps) {
        stack.push(dep);
        edges.push([dep, pkg]);
      }
    } else {
      edges.push([null, pkg]);
    }
  }

  graphCache.set(key, edges);

  return edges;
}

export function getDependentMap(packages: PackageInfos) {
  const graph = getPackageGraph(packages);
  const map = new Map<string, Set<string>>();
  for (const [from, to] of graph) {
    if (!map.has(to)) {
      map.set(to, new Set());
    }

    if (from) {
      map.get(to)!.add(from);
    }
  }

  return map;
}

/**
 * @deprecated Do not use
 * 
 * for a package graph of a->b->c (where b depends on a), transitive consumers of a are b & c and their consumers (or what are the consequences of a)
 * @param targets
 * @param packages
 * @param scope
 */
export function getTransitiveConsumers(
  targets: string[],
  packages: PackageInfos,
  scope: string[] = []
) {
  const graph = getPackageGraph(packages, scope);
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
 * @deprecated Do not use
 * 
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
        if (to === pkg && from) {
          pkgQueue.push(from);
        }
      }
    }
  }

  return [...visited].filter((pkg) => !targets.includes(pkg));
}