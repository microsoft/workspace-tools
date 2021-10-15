export function nameAtVersion(name: string, version: string): string {
  if (!version) {
    return name;
  }
  return `${name}@${version}`;
}
