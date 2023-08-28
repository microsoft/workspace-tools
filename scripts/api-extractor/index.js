const fs = require("fs");
const path = require("path");
const extractor = require("@microsoft/api-extractor");

const cwd = process.cwd();
const configPaths = [path.join(cwd, "api-extractor.json"), path.join(__dirname, "api-extractor.base.json")];
const configPath = configPaths.find((name) => fs.existsSync(name));

if (!configPath) {
  console.error(
    "Could not find API Extractor config under any of the following paths:" +
      configPaths.map((name) => `\n- ${name}`).join("")
  );
  process.exit(1);
}

const rawConfig = extractor.ExtractorConfig.loadFile(configPath);
const preparedConfig = {
  configObject: rawConfig,
  configObjectFullPath: configPath,
  packageJsonFullPath: path.join(cwd, "package.json"),
};

preparedConfig.configObject.projectFolder = cwd;

try {
  const config = extractor.ExtractorConfig.prepare(preparedConfig);

  const result = extractor.Extractor.invoke(config);

  if (!result.apiReportChanged) {
    console.log(`API report is up to date.`);
  } else if (process.env.CI) {
    console.error('API report is out of date. Please run "yarn api" locally and commit the results.');
    process.exit(1);
  } else {
    console.log(`Updating API report file (please check this in): "${config.reportFilePath}"`);
    const configDir = path.dirname(config.reportFilePath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir);
    }
    fs.copyFileSync(config.reportTempFilePath, config.reportFilePath);
  }
} catch (error) {
  console.error('An error occurred:', error.message);

  // Log bug report
  const bugReport = `Bug Report:
  - Error Message: ${error.message}
  - Stack Trace: ${error.stack}`;

  // You can save this bug report to a file or send it to your bug tracking system
  // Example: fs.writeFileSync('bug-report.txt', bugReport);

  process.exit(1);
}
