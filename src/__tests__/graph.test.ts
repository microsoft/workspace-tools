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

    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "b",
            "name": "a",
          },
          Object {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": Array [
          "a",
          "b",
          "c",
        ],
      }
    `);
  });

  it("can represent a graph with some nodes with no edges", () => {
    const allPackages = {
      a: stubPackage("a"),
      b: stubPackage("b"),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages);

    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [],
        "packages": Array [
          "c",
          "b",
          "a",
        ],
      }
    `);
  });

  it("can get linear dependents", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["c"], includeDependents: true });

    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "c",
            "name": "b",
          },
          Object {
            "dependency": "b",
            "name": "a",
          },
        ],
        "packages": Array [
          "c",
          "b",
          "a",
        ],
      }
    `);
  });

  it("will handle circular dependencies", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c", ["a"]),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["a"], includeDependencies: true });

    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "b",
            "name": "a",
          },
          Object {
            "dependency": "c",
            "name": "b",
          },
          Object {
            "dependency": "a",
            "name": "c",
          },
        ],
        "packages": Array [
          "a",
          "b",
          "c",
        ],
      }
    `);
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
