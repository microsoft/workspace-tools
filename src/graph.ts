import { PackageInfo, PackageInfos } from "./types/PackageInfo";
import { getInternalDeps } from "./getInternalDeps";
import { PackageGraph } from "./types/PackageGraph";

const graphCache = new Map<string, PackageGraph>();

function memoizedKey(packages: PackageInfos, scope: string[] = []) {
  return JSON.stringify({ packages: Object.keys(packages), scope });
}

export function getPackageGraph(packages: PackageInfos, scope: string[] = []): PackageGraph {
  const key = memoizedKey(packages, scope);

  if (graphCache.has(key)) {
    return graphCache.get(key)!;
  }

  const graph: PackageGraph = { packages: [], dependencies: [] };
  const visitor = (pkg: string, info: PackageInfo, deps: string[]) => {
    if (deps.length > 0) {
      for (const dep of deps) {
        graph.push([pkg, dep]);
      }
    } else {
      graph.push([null, pkg]);
    }
  };

  visitPackageGraph(packages, visitor, scope);
  graphCache.set(key, graph);

  return graph;
}

export function visitPackageGraph(
  graph: PackageGraph,
  visitor: (pkg: string, info: PackageInfo, deps: string[]) => void,
  scope: string[] = []
) {
  const visited = new Set<string>();
  const stack: string[] = scope.length > 0 ? [...scope] : graph.packages;

  while (stack.length > 0) {
    const pkg = stack.pop()!;

    if (visited.has(pkg)) {
      continue;
    }

    const info = packages[pkg];
    const deps = getInternalDeps(info, packages);

    visitor(pkg, info, deps);

    visited.add(pkg);

    if (deps.length > 0) {
      for (const dep of deps) {
        stack.push(dep);
      }
    }
  }
}

/**
 * @internal resets the graph cache for internal testing purpose only
 */
export function _resetGraphCache() {
  graphCache.clear();
}
