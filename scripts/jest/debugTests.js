const fs = require("fs");
const jest = require("jest");
const path = require("path");

const args = process.argv.slice(2);

function findPackageRoot() {
  let cwd = process.cwd();
  const root = path.parse(cwd).root;

  while (cwd !== root) {
    if (fs.existsSync(path.join(cwd, "package.json"))) return cwd;
    cwd = path.dirname(cwd);
  }
}
const packagePath = findPackageRoot();
if (!packagePath) {
  throw new Error("Could not find package.json relative to " + process.cwd());
}

console.log(`Starting Jest debugging at: ${packagePath}`);

jest.run(["--runInBand", "--watch", "--testTimeout=999999999", ...args], packagePath);
