import { PackageInfo } from "../types/PackageInfo";
import { createPackageGraph } from "../graph";

describe("createPackageGraph", () => {
  it("can get linear dependencies", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["a"], includeDependencies: true });

    expect(actual.packages).toContain("a");
    expect(actual.packages).toContain("b");
    expect(actual.packages).toContain("c");
    expect(actual.dependencies).toContain({ name: "a", dependency: "b" });
    expect(actual.dependencies).toContain({ name: "b", dependency: "c" });
  });
});

function stubPackage(name: string, deps: string[] = []) {
  return {
    name,
    packageJsonPath: `packages/${name}`,
    version: "1.0",
    dependencies: deps.reduce((depMap, dep) => ({ ...depMap, [dep]: "*" }), {}),
    devDependencies: {},
  } as PackageInfo;
}
