import { PackageInfo } from "../types/PackageInfo";
import { createPackageGraph } from "../graph";

describe("createPackageGraph", () => {
  it("namePatterns is an empty array", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: [], includeDependencies: true });
    /*
    { packages: [], dependencies: [] }
    */
  });

  it("can exclude peer dependencies", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"], ["d"], ["e"]),
      c: stubPackage("c"),
      d: stubPackage("d"),
      e: stubPackage("e"),
    };
    const actual = createPackageGraph(allPackages, {
      namePatterns: ["b"],
      includeDependencies: true,
      withDevDependencies: true,
      withPeerDependencies: false,
    });
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [
          {
            "dependency": "c",
            "name": "b",
          },
          {
            "dependency": "d",
            "name": "b",
          },
        ],
        "packages": [
          "b",
          "c",
          "d",
        ],
      }
    `);
  });

  it("can exclude development dependencies", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"], ["d"]),
      c: stubPackage("c"),
      d: stubPackage("d"),
    };
    const actual = createPackageGraph(allPackages, {
      namePatterns: ["b"],
      includeDependencies: true,
      withDevDependencies: false,
    });
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [
          {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": [
          "b",
          "c",
        ],
      }
    `);
  });

  it("returns the name patterns when includeDependencies & includeDependents are set to false", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages, { namePatterns: ["a", "b"] });
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [],
        "packages": [
          "b",
          "a",
        ],
      }
    `);
  });

  it("provides the entire graph if scope is not provided", () => {
    const allPackages = {
      a: stubPackage("a", ["b"]),
      b: stubPackage("b", ["c"]),
      c: stubPackage("c"),
    };

    const actual = createPackageGraph(allPackages);
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [
          {
            "dependency": "c",
            "name": "b",
          },
          {
            "dependency": "b",
            "name": "a",
          },
        ],
        "packages": [
          "c",
          "b",
          "a",
        ],
      }
    `);
  });

  it("does not repeat packages & edges when the same filter is provided twice", () => {
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
    const actual = createPackageGraph(allPackages, [
      {
        namePatterns: ["e"],
        includeDependents: true,
      },
      {
        namePatterns: ["e"],
        includeDependents: true,
      },
    ]);
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [
          {
            "dependency": "e",
            "name": "b",
          },
          {
            "dependency": "e",
            "name": "c",
          },
          {
            "dependency": "b",
            "name": "i",
          },
        ],
        "packages": [
          "e",
          "b",
          "c",
          "i",
        ],
      }
    `);
  });

  it("can get take multiple filters as an UNION of the two filters", () => {
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
    const actual = createPackageGraph(allPackages, [
      {
        namePatterns: ["e"],
        includeDependents: true,
      },
      {
        namePatterns: ["e"],
        includeDependencies: true,
      },
    ]);
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [
          {
            "dependency": "e",
            "name": "b",
          },
          {
            "dependency": "e",
            "name": "c",
          },
          {
            "dependency": "b",
            "name": "i",
          },
          {
            "dependency": "f",
            "name": "e",
          },
          {
            "dependency": "h",
            "name": "e",
          },
          {
            "dependency": "j",
            "name": "h",
          },
        ],
        "packages": [
          "e",
          "b",
          "c",
          "i",
          "f",
          "h",
          "j",
        ],
      }
    `);
  });

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
      namePatterns: ["a", "c"],
      includeDependencies: true,
      includeDependents: true,
    });
    expect(actual).toMatchInlineSnapshot(`
      {
        "dependencies": [
          {
            "dependency": "e",
            "name": "c",
          },
          {
            "dependency": "f",
            "name": "e",
          },
          {
            "dependency": "h",
            "name": "e",
          },
          {
            "dependency": "e",
            "name": "b",
          },
          {
            "dependency": "d",
            "name": "b",
          },
          {
            "dependency": "b",
            "name": "i",
          },
          {
            "dependency": "f",
            "name": "d",
          },
          {
            "dependency": "d",
            "name": "a",
          },
          {
            "dependency": "j",
            "name": "h",
          },
        ],
        "packages": [
          "c",
          "e",
          "f",
          "h",
          "b",
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
      {
        "dependencies": [
          {
            "dependency": "f",
            "name": "e",
          },
          {
            "dependency": "h",
            "name": "e",
          },
          {
            "dependency": "j",
            "name": "h",
          },
        ],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "b",
            "name": "a",
          },
        ],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "b",
            "name": "a",
          },
          {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "c",
            "name": "b",
          },
          {
            "dependency": "b",
            "name": "a",
          },
        ],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "c",
            "name": "b",
          },
          {
            "dependency": "d",
            "name": "b",
          },
          {
            "dependency": "c",
            "name": "a",
          },
        ],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "d",
            "name": "b",
          },
          {
            "dependency": "c",
            "name": "a",
          },
          {
            "dependency": "c",
            "name": "b",
          },
        ],
        "packages": [
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
      {
        "dependencies": [],
        "packages": [
          "c",
          "b",
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
      {
        "dependencies": [],
        "packages": [
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
      {
        "dependencies": [
          {
            "dependency": "b",
            "name": "a",
          },
          {
            "dependency": "c",
            "name": "b",
          },
          {
            "dependency": "a",
            "name": "c",
          },
        ],
        "packages": [
          "a",
          "b",
          "c",
        ],
      }
    `);
  });
});

function stubPackage(name: string, deps: string[] = [], devDeps: string[] = [], peerDeps: string[] = []) {
  return {
    name,
    packageJsonPath: `packages/${name}`,
    version: "1.0",
    dependencies: deps.reduce((depMap, dep) => ({ ...depMap, [dep]: "*" }), {}),
    devDependencies: devDeps.reduce((depMap, dep) => ({ ...depMap, [dep]: "*" }), {}),
    peerDependencies: peerDeps.reduce((depMap, dep) => ({ ...depMap, [dep]: "*" }), {}),
  } as PackageInfo;
}
