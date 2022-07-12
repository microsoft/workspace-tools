import { PackageInfo } from "../types/PackageInfo";
import { createPackageGraph } from "../graph";

describe("createPackageGraph", () => {
  it("can get dependencies and dependents for multiple name patterns", () => {
    const allPackages = {
      a: stubPackage("a", ["d"]),
      b: stubPackage("b", ["d", "e"]),
      c: stubPackage("c", ["e"]),
      d: stubPackage("d", ["f"]),
      e: stubPackage("e", ["f", "h"]),
      f: stubPackage("f"),
      h: stubPackage("h", ["j"]),
      g: stubPackage("g"),
      i: stubPackage("i", ["b"]),
      j: stubPackage("j"),
    };
    const actual = createPackageGraph(allPackages, {
      namePatterns: ["a", "e"],
      includeDependencies: true,
      includeDependents: true,
    });
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "f",
            "name": "e",
          },
          Object {
            "dependency": "h",
            "name": "e",
          },
          Object {
            "dependency": "e",
            "name": "b",
          },
          Object {
            "dependency": "e",
            "name": "c",
          },
          Object {
            "dependency": "d",
            "name": "b",
          },
          Object {
            "dependency": "b",
            "name": "i",
          },
          Object {
            "dependency": "f",
            "name": "d",
          },
          Object {
            "dependency": "d",
            "name": "a",
          },
          Object {
            "dependency": "j",
            "name": "h",
          },
        ],
        "packages": Array [
          "e",
          "f",
          "h",
          "b",
          "c",
          "d",
          "i",
          "a",
          "j",
        ],
      }
    `);
  });

  it("can get dependencies and dependents for a name pattern", () => {
    const allPackages = {
      a: stubPackage("a", ["d"]),
      b: stubPackage("b", ["d", "e"]),
      c: stubPackage("c", ["e"]),
      d: stubPackage("d", ["f"]),
      e: stubPackage("e", ["f", "h"]),
      f: stubPackage("f"),
      h: stubPackage("h", ["j"]),
      g: stubPackage("g"),
      i: stubPackage("i", ["b"]),
      j: stubPackage("j"),
    };

    const actual = createPackageGraph(allPackages, {
      namePatterns: ["e"],
      includeDependencies: true,
      includeDependents: false,
    });

    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "f",
            "name": "e",
          },
          Object {
            "dependency": "h",
            "name": "e",
          },
          Object {
            "dependency": "j",
            "name": "h",
          },
        ],
        "packages": Array [
          "e",
          "f",
          "h",
          "j",
        ],
      }
    `);
  });

  it("can get direct dependencies", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["b"], includeDependencies: true });
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": Array [
          "b",
          "c",
        ],
      }
    `);
  });

  it("can get direct dependents", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["b"], includeDependents: true });
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "b",
            "name": "a",
          },
        ],
        "packages": Array [
          "b",
          "a",
        ],
      }
    `);
  });

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

  it("can get dependencies for multiple patterns given", () => {
    const allPackages = {
      a: stubPackage("a", ["c"]),
      b: stubPackage("b", ["c", "d"]),
      c: stubPackage("c"),
      d: stubPackage("d"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["a", "b"], includeDependencies: true });
    expect(actual).toMatchInlineSnapshot(`
          Object {
            "dependencies": Array [
              Object {
                "dependency": "c",
                "name": "b",
              },
              Object {
                "dependency": "d",
                "name": "b",
              },
              Object {
                "dependency": "c",
                "name": "a",
              },
            ],
            "packages": Array [
              "b",
              "c",
              "d",
              "a",
            ],
          }
      `);
  });

  it("can get dependents for multiple patterns given", () => {
    const allPackages = {
      a: stubPackage("a", ["c"]),
      b: stubPackage("b", ["c", "d"]),
      c: stubPackage("c"),
      d: stubPackage("d"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["c", "d"], includeDependents: true });
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "dependencies": Array [
          Object {
            "dependency": "d",
            "name": "b",
          },
          Object {
            "dependency": "c",
            "name": "a",
          },
          Object {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": Array [
          "d",
          "b",
          "c",
          "a",
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
