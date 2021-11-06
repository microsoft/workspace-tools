import { setupFixture } from "../helpers/setupFixture";
import { parseLockFile } from "../lockfile";

describe("parseLockFile()", () => {
  it("parses yarn.lock file when it is found", async () => {
    const packageRoot = await setupFixture("basic");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile).toHaveProperty("type", "success");
  });
  
  it("parses yarn2 yarn.lock file when it is found", async () => {
    const packageRoot = await setupFixture("basic-yarn2");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile).toHaveProperty("type", "success");
  });

  it("throws if it cannot find a yarn.lock file", async () => {
    const packageRoot = await setupFixture("basic-without-lock-file");

    await expect(parseLockFile(packageRoot)).rejects.toThrow(
      "You do not have either yarn.lock nor pnpm-lock.yaml. Please use one of these package managers"
    );
  });

  it("parses version strings in yarn.lock", async () => {
    const packageRoot = await setupFixture("basic-yarn");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile.object["@babel/code-frame@^7.0.0"].version).toBe(
      '7.8.3'
    );
  });

  it("parses combined ranges in yarn.lock", async () => {
    const packageRoot = await setupFixture("basic-yarn");
    const parsedLockeFile = await parseLockFile(packageRoot);

    expect(parsedLockeFile.object["@babel/code-frame@^7.0.0"].version).toBe(
      parsedLockeFile.object["@babel/code-frame@^7.8.3"].version
    );
  });

    it("parses version strings in yarn2 yarn.lock", async () => {
    const packageRoot = await setupFixture("basic-yarn2");
    const parsedLockeFile = await parseLockFile(packageRoot);
    expect(parsedLockeFile.object["strip-json-comments@npm:^3.1.1"].version).toBe(
      "3.1.1"
    );
  });

  it("parses combined ranges in yarn2 yarn.lock", async () => {
    const packageRoot = await setupFixture("basic-yarn2");
    const parsedLockeFile = await parseLockFile(packageRoot);
    expect(parsedLockeFile.object["strip-json-comments@npm:^3.1.0"].version).toBe(
      parsedLockeFile.object["strip-json-comments@npm:^3.1.1"].version
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
