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
