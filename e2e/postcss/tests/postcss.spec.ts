import { newProject } from "@nrwl/e2e/utils";
import {
  checkFilesExist,
  readFile,
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

  it("can build a CSS file", async () => {
    const mylib = uniq("executor-build");
    await runNxCommandAsync(
      `generate @topplethenun/nx-plugin-postcss:library ${mylib} --buildable`
    );
    await runNxCommandAsync(`run-many --target=build --projects=${mylib}`);
    expect(() => {
      checkFilesExist(`dist/libs/${mylib}/dist/index.css`);
    }).not.toThrow();
    const actualContents = readFile(`dist/libs/${mylib}/dist/index.css`);
    expect(actualContents).toMatchSnapshot();
  }, 500000);
});
