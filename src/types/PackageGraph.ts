/** A package graph edge that defines a single package name and one of its dependency */
export interface PackageDependency {
  name: string;
  dependency: string;
};

/** The graph is defined by as a list of package names as nodes, and a list of PackageDependency as edges*/
export interface PackageGraph {
  // Nodes
  packages: string[];

  // Edges
  dependencies: PackageDependency[];
}

/** Package graph visitor is called as it visits every package in dependency order */
export interface PackageGraphVisitor {
  (pkg: string, dependencies: string[], dependents: string[]): void;
}
