import path from "path";

import { setupFixture } from "../helpers/setupFixture";
import { getPnpmWorkspaces } from "../workspaces/getWorkspaces/pnpmWorkspaces";

describe("getPnpmWorkspaces()", () => {
  it("gets the name and path of the workspaces", async () => {
    const packageRoot = await setupFixture("monorepo-pnpm");
    const workspacesPackageInfo = getPnpmWorkspaces(packageRoot);

    const packageAPath = path.join(packageRoot, "packages", "package-a");
    const packageBPath = path.join(packageRoot, "packages", "package-b");

    expect(workspacesPackageInfo).toMatchObject([
      { name: "package-a", path: packageAPath },
      { name: "package-b", path: packageBPath },
    ]);
  });
});
