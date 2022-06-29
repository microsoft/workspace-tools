import { getPackageGraph, visitPackageGraph } from "./graph";
import { PackageGraph } from "./types/PackageGraph";
import { PackageInfo, PackageInfos } from "./types/PackageInfo";

export function getAffectedPackageGraph(packages: PackageInfos, scope: string[]): PackageGraph {
  return { packages: [], dependencies: [] };
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

function getDependenciesGraph(packages: PackageInfos, scope: string[]) {
  const graph = getPackageGraph(packages, scope);
  const map = new Map<string, Set<string>>();
  for (const [from, to] of graph) {
    if (!map.has(from)) {
      map.set(from, new Set());
    }

    map.get(from)!.add(to);
  }

  return map;
}

function getDependentGraph(packages: PackageInfos, scope: string[]) {
  const graph = getPackageGraph(packages, scope);
  const map = new Map<string, Set<string>>();
  for (const [from, to] of graph) {
    if (!map.has(from)) {
      map.set(from, new Set());
    }

    map.get(from)!.add(to);
  }

  return map;
}
