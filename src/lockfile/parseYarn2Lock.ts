import * as yaml from 'yaml';
import { ParsedLock } from './types';

function isYarnVersionLock(versionCandidate: unknown): versionCandidate is {version: string} {
    return (typeof versionCandidate === 'object') && versionCandidate !== null && (versionCandidate.hasOwnProperty('version'))
}

export async function parseYarn2Lock(lockfileContentString: string) : Promise<ParsedLock> {
    const yarnLockContent = yaml.parse(lockfileContentString)
    delete yarnLockContent['__metadata']
    const lockedDeps: ParsedLock['object'] = {};

    for (let [descriptors, lockedVersion] of Object.entries(yarnLockContent)) {
        for (let versionDescriptor of descriptors.split(/, /g)) {
            if (isYarnVersionLock(lockedVersion)) {
                lockedDeps[versionDescriptor] = {
                    version: lockedVersion.version
                }
            } else {
                throw new Error(`Malformed version in yarn2 lock "${JSON.stringify(lockedVersion)}"`)
            }
        }
    }

    return {
        type: 'success',
        object: lockedDeps
    }
}