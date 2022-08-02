import { nameAtVersion } from "./nameAtVersion";
import { LockDependency, ParsedLock, PnpmLockFile } from "./types";

export function parsePnpmLock(yaml: PnpmLockFile): ParsedLock {
  const object: {
    [key in string]: LockDependency;
  } = {};

  if (yaml && yaml.packages) {
    for (const [pkgSpec, snapshot] of Object.entries(yaml.packages)) {
      // TODO: handle file:foo.tgz syntax (rush uses this for internal package links)
      const specParts = pkgSpec.split(/\//);
      const name = specParts.length > 3 ? `${specParts[1]}/${specParts[2]}` : specParts[1];
      const version = specParts.length > 3 ? specParts[3] : specParts[2];

      object[nameAtVersion(name, version)] = {
        version,
        dependencies: snapshot.dependencies,
      };
    }
  }

  return {
    object,
    type: "success",
  };
}
