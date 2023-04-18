import { exec } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import path from "path";

new (class {
  private configFile: string = path.join(__dirname, "package.json");
  private readmeFile: string = path.join(__dirname, "readme.md");
  private readmeVersionRegEx = /\/panda-events@[\d\\.]+\//gi;

  constructor() {
    this.replaceVersion()
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }

  getNextVersion(version: string) {
    const increment = 1;

    const parts = version.split(".").map((n) => parseInt(n));
    const lastIndex = parts.length - 1;

    parts[lastIndex] = parts[lastIndex] + increment;

    for (let i = lastIndex; i > 0; i--) {
      if (parts[i] > 9) {
        parts[i] = 0;
        parts[i - 1] = parts[i - 1] + 1;
      }
    }

    return parts.join(".");
  }

  async replaceVersion() {
    const config = JSON.parse(await readFileSync(this.configFile, "utf-8"));
    const newVersion = this.getNextVersion(config.version);
    config.version = newVersion;

    let readmeContent = await readFileSync(this.readmeFile, "utf-8");
    console.log(readmeContent.match(this.readmeVersionRegEx));
    readmeContent = readmeContent.replace(
      this.readmeVersionRegEx,
      `/panda-events@${newVersion}/`
    );

    await writeFileSync(this.configFile, JSON.stringify(config));
    await writeFileSync(this.readmeFile, readmeContent);
  }

  publish() {
    exec("npm publish", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        process.exit(1);
      } else {
        if (stdout) {
          console.log(stdout);
        }
        if (stderr) {
          console.error(stderr);
        }
      }
    });
  }
})();
