import path from "path";

import { setupFixture } from "../helpers/setupFixture";
import { getYarnWorkspaces } from "../workspaces/getWorkspaces/yarnWorkspaces";

describe("getYarnWorkspaces()", () => {
  it("gets the name and path of the workspaces", async () => {
    const packageRoot = await setupFixture("monorepo");
    const workspacesPackageInfo = getYarnWorkspaces(packageRoot);

    const packageAPath = path.join(packageRoot, "packages", "package-a");
    const packageBPath = path.join(packageRoot, "packages", "package-b");

    expect(workspacesPackageInfo).toMatchObject([
      { name: "package-a", path: packageAPath },
      { name: "package-b", path: packageBPath },
    ]);
  });
});
