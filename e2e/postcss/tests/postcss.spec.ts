import { newProject } from "@nrwl/e2e/utils";
import {
  checkFilesExist,
  runNxCommandAsync,
  uniq,
} from "@nrwl/nx-plugin/testing";

describe("PostCSS", () => {
  beforeAll(() =>
    newProject({
      npmPackageName: "@topplethenun/nx-plugin-postcss",
      pluginDistPath: "dist/packages/postcss",
    })
  );

  it("creates postcss.config.js", async () => {
    const mylib = uniq("generator-configuration");
    await runNxCommandAsync(`generate @nrwl/workspace:lib ${mylib}`);
    await runNxCommandAsync(
      `generate @topplethenun/nx-plugin-postcss:configuration --project ${mylib}`
    );

    expect(() => {
      checkFilesExist(`libs/${mylib}/postcss.config.js`);
    }).not.toThrow();
  }, 500000);
});
