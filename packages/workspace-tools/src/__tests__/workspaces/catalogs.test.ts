import fs from "fs";
import path from "path";
import { cleanupFixtures, setupFixture } from "@ws-tools/scripts/jest/setupFixture";
import type { Catalogs } from "../../types/Catalogs";
import { getCatalogs, getCatalogVersion } from "../../workspaces/catalogs";
import type { WorkspaceManager } from "../../workspaces/WorkspaceManager";
import { getWorkspaceManagerAndRoot } from "../../workspaces/implementations";
import { getPackageInfo } from "../../getPackageInfo";

// Samples from https://yarnpkg.com/features/catalogs
const defaultCatalogs: Required<Pick<Catalogs, "default">> = {
  default: {
    react: "^18.2.0",
    lodash: "^4.17.21",
  },
};

const namedCatalogs: Required<Catalogs> = {
  named: {
    react17: {
      react: "^17.0.2",
      "react-dom": "^17.0.2",
    },
    react18: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
  },
  default: {
    lodash: "^4.17.21",
  },
};

/** Convert catalogs to the yaml format used by yarn v4 and pnpm */
function catalogsToYaml(catalogs: Catalogs): string {
  const { named, default: defaultCatalog } = catalogs;
  const lines: string[] = [];

  if (defaultCatalog) {
    lines.push("catalog:");
    for (const [pkg, version] of Object.entries(defaultCatalog)) {
      lines.push(`  ${pkg}: ${version}`);
    }
  }

  if (named) {
    lines.push("catalogs:");
    for (const [catalogName, catalogEntries] of Object.entries(named)) {
      lines.push(`  ${catalogName}:`);
      for (const [pkg, version] of Object.entries(catalogEntries)) {
        lines.push(`    ${pkg}: ${version}`);
      }
    }
  }

  return lines.join("\n");
}

describe("getCatalogs", () => {
  afterAll(() => {
    cleanupFixtures();
  });

  describe("unsupported managers", () => {
    // Test unsupported managers first
    it.each<{ manager: string; fixtureName: string }>([
      { manager: "npm", fixtureName: "monorepo-npm" },
      { manager: "rush", fixtureName: "monorepo-rush-pnpm" },
    ])("returns undefined for $manager monorepo", ({ manager, fixtureName }) => {
      const fixturePath = setupFixture(fixtureName);
      // verify manager detection
      expect(getWorkspaceManagerAndRoot(fixturePath)).toEqual({ manager, root: fixturePath });

      const catalogs = getCatalogs(fixturePath);
      expect(catalogs).toBeUndefined();
    });
  });

  describe.each<{
    name: string;
    manager: WorkspaceManager;
    // The repo and catalog file format is different per manager, but the other test logic is reused
    baseFixture: string;
    addCatalogs: (root: string, catalogs: Catalogs) => void;
  }>([
    {
      name: "pnpm",
      manager: "pnpm",
      baseFixture: "monorepo-pnpm",
      addCatalogs: (root, catalogs) => {
        // https://pnpm.io/catalogs
        const pnpmWorkspacePath = path.join(root, "pnpm-workspace.yaml");
        fs.appendFileSync(pnpmWorkspacePath, `\n${catalogsToYaml(catalogs)}\n`);
      },
    },
    {
      name: "yarn v4",
      manager: "yarn",
      baseFixture: "monorepo-yarn-berry",
      addCatalogs: (root, catalogs) => {
        // https://yarnpkg.com/features/catalogs
        const yarnrcPath = path.join(root, ".yarnrc.yml");
        fs.appendFileSync(yarnrcPath, `\n${catalogsToYaml(catalogs)}\n`);
      },
    },
    {
      name: "midgard-yarn-strict",
      manager: "yarn",
      baseFixture: "monorepo",
      addCatalogs: (root, catalogs) => {
        const { packageJsonPath, ...packageJson } = getPackageInfo(root)!;
        packageJson.workspaces = Array.isArray(packageJson.workspaces)
          ? { packages: packageJson.workspaces }
          : packageJson.workspaces || { packages: [] };
        const { named, default: defaultCatalog } = catalogs;
        defaultCatalog && (packageJson.workspaces.catalog = defaultCatalog);
        named && (packageJson.workspaces.catalogs = named);
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      },
    },
  ])("$name", ({ manager, baseFixture, addCatalogs }) => {
    let fixturePath = "";

    beforeEach(() => {
      fixturePath = setupFixture(baseFixture);
      expect(getWorkspaceManagerAndRoot(fixturePath)).toEqual({ manager, root: fixturePath });
    });

    it("returns undefined if no catalogs", () => {
      const catalogs = getCatalogs(fixturePath);
      expect(catalogs).toBeUndefined();
    });

    it("returns default catalogs if defined alone", () => {
      addCatalogs(fixturePath, defaultCatalogs);

      const catalogs = getCatalogs(fixturePath);
      expect(catalogs).toEqual(defaultCatalogs);
    });

    it("returns named catalogs if defined alone", () => {
      addCatalogs(fixturePath, { named: namedCatalogs.named });

      const catalogs = getCatalogs(fixturePath);
      expect(catalogs).toEqual({ named: namedCatalogs.named });
    });

    it("returns both default and named catalogs if both defined", () => {
      addCatalogs(fixturePath, namedCatalogs);

      const catalogs = getCatalogs(fixturePath);
      expect(catalogs).toEqual(namedCatalogs);
    });
  });
});

describe("getCatalogVersion", () => {
  it("returns undefined for non-catalog versions", () => {
    const result = getCatalogVersion({ name: "react", version: "1.2.3", catalogs: defaultCatalogs });
    expect(result).toBeUndefined();
  });

  it("returns version from default catalog", () => {
    const result = getCatalogVersion({ name: "react", version: "catalog:", catalogs: defaultCatalogs });
    expect(result).toBe("^18.2.0");
  });

  it("returns version from named catalog", () => {
    const result17 = getCatalogVersion({ name: "react", version: "catalog:react17", catalogs: namedCatalogs });
    expect(result17).toBe("^17.0.2");
    const result18 = getCatalogVersion({ name: "react", version: "catalog:react18", catalogs: namedCatalogs });
    expect(result18).toBe("^18.2.0");
  });

  it("throws if catalog version used but no catalogs defined", () => {
    expect(() => getCatalogVersion({ name: "react", version: "catalog:", catalogs: undefined })).toThrow(
      'Dependency "react" uses a catalog version "catalog:" but no catalogs are defined.'
    );
  });

  it("throws if default catalog version used but no default catalog defined", () => {
    expect(() =>
      getCatalogVersion({ name: "react", version: "catalog:", catalogs: { named: namedCatalogs.named } })
    ).toThrow('Dependency "react" uses a catalog version "catalog:" but the default catalog is not defined.');
  });

  it("throws if named catalog version used but no named catalogs defined", () => {
    expect(() => getCatalogVersion({ name: "react", version: "catalog:react17", catalogs: defaultCatalogs })).toThrow(
      'Dependency "react" uses a catalog version "catalog:react17" but catalogs.react17 is not defined.'
    );
  });

  it("throws if catalog name is invalid", () => {
    expect(() => getCatalogVersion({ name: "react", version: "catalog:nope", catalogs: namedCatalogs })).toThrow(
      'Dependency "react" uses a catalog version "catalog:nope" but catalogs.nope is not defined.'
    );
  });

  it("throws if package not found in catalog", () => {
    expect(() => getCatalogVersion({ name: "vue", version: "catalog:", catalogs: defaultCatalogs })).toThrow(
      'Dependency "vue" uses a catalog version "catalog:", but the default catalog doesn\'t define a version for "vue".'
    );
  });

  it("throws on recursive catalog version", () => {
    const catalogs: Catalogs = {
      named: {
        react18: { react: "^18.0.0" },
        bad: { react: "catalog:react18" },
      },
    };
    expect(() => getCatalogVersion({ name: "react", version: "catalog:bad", catalogs })).toThrow(
      'Dependency "react" resolves to a recursive catalog version "catalog:react18", which is not supported.'
    );
  });
});
