import path from "path";

import { setupFixture } from "../helpers/setupFixture";
import { getRushWorkspaces } from "../getWorkspaces/rushWorkspaces";

describe("getRushWorkspaces()", () => {
  it("gets the name and path of the workspaces", async () => {
    const packageRoot = await setupFixture("monorepo-rush-pnpm");
    const workspacesPackageInfo = getRushWorkspaces(packageRoot);

    const packageAPath = path.join(packageRoot, "packages", "package-a");
    const packageBPath = path.join(packageRoot, "packages", "package-b");

    expect(workspacesPackageInfo).toEqual([
      { name: "package-a", path: packageAPath },
      { name: "package-b", path: packageBPath },
    ]);
  });
});
