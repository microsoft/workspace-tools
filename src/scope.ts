import { PackageInfos } from "./types/PackageInfo";
import matcher from "matcher";

export function getScopedPackages(scopes: string[], packages: PackageInfos) {
  return matcher.isMatch(Object.keys(packages), scopes);
}
