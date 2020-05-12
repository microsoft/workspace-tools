import { PackageInfos } from "./types/PackageInfo";
import multimatch from "multimatch";

export function getScopedPackages(scopes: string[], packages: PackageInfos) {
  return multimatch(Object.keys(packages), scopes);
}
