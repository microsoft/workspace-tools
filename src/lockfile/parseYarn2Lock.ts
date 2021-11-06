import * as yaml from "yaml";
import { ParsedLock } from "./types";
import { structUtils } from "@yarnpkg/core";

/**
 * Yarn 2 uses a nonstandard way to represent locked versions
 * from within its lockfiles. This supports custom behaviours
 * such as applying patches, symlinks, linking within the same
 * workspace, and so in
 */
function normaliseYarn2Descriptor(descriptorString: string): string | null {
  const descriptor = structUtils.parseDescriptor(descriptorString);
  const range = structUtils.parseRange(descriptor.range);
  const nameWithScope = `${descriptor.scope ? "@" + descriptor.scope + "/" : ""}${descriptor.name}`;
  // Protocol set from https://yarnpkg.com/features/protocols
  const { protocol, selector } = range;
  switch (protocol) {
    case "npm:":
    case "file:":
    case "link:":
    case "portal:":
      return `${nameWithScope}@${selector}`;
    case "git:":
    case "git+ssh:":
    case "git+http:":
    case "git+https:":
    case "github:":
      return `${nameWithScope}@${protocol}${selector}`;
    case "exec:":
      // exec is nonstandard, an experiemental within yarn2. Cannot be
      // normalised to anything. Track it as a * dependency so that
      // consumers of workspace-tools will find, at least, a *
      return `${nameWithScope}@*`;
    case "workspace:":
      // workspace-tools does not expect workspace dependencies to be
      // present in the yarnlock
      return null;
    default:
      // if we encounter an unrecognised protocol, use the unmodiifed
      // descriptor
      return descriptorString;
  }
}

function isYarnVersionLock(versionCandidate: unknown): versionCandidate is { version: string } {
  return (
    typeof versionCandidate === "object" && versionCandidate !== null && versionCandidate.hasOwnProperty("version")
  );
}

export async function parseYarn2Lock(lockfileContentString: string): Promise<ParsedLock> {
  const yarnLockContent = yaml.parse(lockfileContentString);
  delete yarnLockContent["__metadata"];
  const lockedDeps: ParsedLock["object"] = {};

  for (let [descriptors, lockedVersion] of Object.entries(yarnLockContent)) {
    for (let versionDescriptor of descriptors.split(/, /g)) {
      if (isYarnVersionLock(lockedVersion)) {
        const normalisedDescriptor = normaliseYarn2Descriptor(versionDescriptor);
        if (normalisedDescriptor) {
          lockedDeps[normalisedDescriptor] = {
            version: lockedVersion.version,
          };
        }
      } else {
        throw new Error(`Malformed version in yarn2 lock "${JSON.stringify(lockedVersion)}"`);
      }
    }
  }

  return {
    type: "success",
    object: lockedDeps,
  };
}
