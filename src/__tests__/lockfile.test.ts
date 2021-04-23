import * as path from "path";
import { setupFixture } from "../helpers/setupFixture";
import { parseLockFile } from "../lockfile";

describe("parseLockFile()", () => {
  it("parses yarn.lock file when it is found", async () => {
    const packageRoot = await setupFixture("basic");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile).toHaveProperty("type", "success");
  });

  it("throws if it cannot find a yarn.lock file", async () => {
    const packageRoot = await setupFixture("basic-without-lock-file");

    await expect(parseLockFile(packageRoot)).rejects.toThrow(
      "You do not have either yarn.lock nor pnpm-lock.yaml. Please use one of these package managers"
    );
  });

  it("parses combined ranges in yarn.lock", async () => {
    const packageRoot = await setupFixture("basic-yarn");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile.object["@babel/code-frame@^7.0.0"].version).toBe(
      parsedLockeFile.object["@babel/code-frame@^7.8.3"].version
    );
  });

  it("parses pnpm-lock.yaml properly", async () => {
    const packageRoot = await setupFixture("basic-pnpm");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(Object.keys(parsedLockeFile.object["yargs@16.2.0"].dependencies!)).toContain(
      "cliui"
    );
  });
});
