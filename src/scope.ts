import matcher from "matcher";

/**
 * Searches all package names based on "scoping" (i.e. "scope" in the sense of inclusion)
 * NOTE: scoping is different than package scopes (@scope/package)
 * @param searchScopes
 * @param packages
 */
export function getScopedPackages(
  searchScopes: string[],
  packages: { [pkg: string]: unknown } | string[]
) {
  const packageNames = Array.isArray(packages)
    ? packages
    : Object.keys(packages);

  const barePackageMap: { [key: string]: string[] } = {};

  let inputs = packageNames;

  // Step 1: create a map of bare package name -> list of full package names
  // NOTE: do not perform barePackageMap lookup if any of the "scopes" arg starts with "@"
  if (!searchScopes.find((scope) => scope.startsWith("@"))) {
    for (const pkg of packageNames) {
      const bare = pkg.replace(/^@[^/]+\//, "");
      barePackageMap[bare] = barePackageMap[bare] || [];
      barePackageMap[bare].push(pkg);
    }
    inputs = Object.keys(barePackageMap);
  }

  // Step 2: do the matcher algorithm (with support for wildcards like *)
  const matched = matcher(inputs, searchScopes);

  // Step 3: reconstruct the list of full package names
  let results: string[] = [];
  for (const bare of matched) {
    results = results.concat(barePackageMap[bare]);
  }

  return results;
}
