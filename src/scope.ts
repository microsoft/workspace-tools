import matcher from "matcher";

export function getScopedPackages(
  scopes: string[],
  packages: { [pkg: string]: unknown } | string[]
) {
  const packageNames = Array.isArray(packages)
    ? packages
    : Object.keys(packages);
  const barePackageMap: { [key: string]: string[] } = {};

  // Step 1: create a map of bare package name -> list of full package names
  for (const pkg of packageNames) {
    const bare = pkg.replace(/^@[^/]+\//, "");
    barePackageMap[bare] = barePackageMap[bare] || [];
    barePackageMap[bare].push(pkg);
  }

  // Step 2: do the matcher algorithm (with support for wildcards like *)
  const matched = matcher(Object.keys(barePackageMap), scopes);

  // Step 3: reconstruct the list of full package names
  let results: string[] = [];
  for (const bare of matched) {
    results = results.concat(barePackageMap[bare]);
  }

  return results;
}
