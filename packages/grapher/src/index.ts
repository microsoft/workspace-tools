import commander from "commander";
import { depsCommand } from "./commands/depsCommand";

async function main() {
  try {
    const program = new commander.Command();
    program.version(require("../package.json").version);
    program
      .command("deps")
      .description("Generate a list of dependencies and dependents for a package")
      .option("--scope <package...>", "Package names, give multiple names by have multiple --scope flags")
      .action(depsCommand);

    program.parse(process.argv);
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.stack);
    } else {
      console.error(String(e));
    }
    process.exit(1);
  }
}

main();
