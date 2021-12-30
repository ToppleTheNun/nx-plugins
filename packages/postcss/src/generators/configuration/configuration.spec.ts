import {
  addDependenciesToPackageJson,
  readJson,
  readProjectConfiguration,
  Tree,
} from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { libraryGenerator } from "@nrwl/workspace/generators";
import configurationGenerator from "./configuration";

describe("@topplethenun/nx-plugin-postcss:configuration", () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: "test-ui-lib",
      standaloneConfig: false,
    });
  });

  describe("dependencies for package.json", () => {
    it("adds postcss if not already present", async () => {
      const existing = "existing";
      const existingVersion = "1.0.0";
      addDependenciesToPackageJson(
        tree,
        { [existing]: existingVersion },
        { [existing]: existingVersion }
      );

      await configurationGenerator(tree, { project: "test-ui-lib" });

      const packageJson = readJson(tree, "package.json");
      expect(packageJson).toMatchSnapshot();

      expect(packageJson.devDependencies["postcss"]).toEqual("^8.0.0");
      expect(packageJson.devDependencies["postcss-preset-env"]).toEqual(
        "^7.0.0"
      );
    });

    it("does not add postcss if already present", async () => {
      const existing = "existing";
      const existingVersion = "1.0.0";
      addDependenciesToPackageJson(
        tree,
        { [existing]: existingVersion },
        { postcss: "7", [existing]: existingVersion }
      );

      await configurationGenerator(tree, { project: "test-ui-lib" });

      const packageJson = readJson(tree, "package.json");
      expect(packageJson).toMatchSnapshot();

      expect(packageJson.devDependencies["postcss"]).toEqual("7");
      expect(packageJson.devDependencies["postcss-preset-env"]).toEqual(
        "^7.0.0"
      );
    });

    it("does not add postcss-preset-env if already present", async () => {
      const existing = "existing";
      const existingVersion = "1.0.0";
      addDependenciesToPackageJson(
        tree,
        { [existing]: existingVersion },
        { "postcss-preset-env": "7", [existing]: existingVersion }
      );

      await configurationGenerator(tree, { project: "test-ui-lib" });

      const packageJson = readJson(tree, "package.json");
      expect(packageJson).toMatchSnapshot();

      expect(packageJson.devDependencies["postcss"]).toEqual("^8.0.0");
      expect(packageJson.devDependencies["postcss-preset-env"]).toEqual("7");
    });
  });

  it("should generate files", async () => {
    await configurationGenerator(tree, { project: "test-ui-lib" });

    expect(tree.exists("libs/test-ui-lib/postcss.config.js")).toBeTruthy();
  });

  it("should update workspace file", async () => {
    await configurationGenerator(tree, {
      project: "test-ui-lib",
    });
    const project = readProjectConfiguration(tree, "test-ui-lib");

    expect(project.targets.build).toEqual({
      executor: "@topplethenun/nx-plugin-postcss:package",
      outputs: ["{options.outputPath}"],
      options: {
        outputPath: "dist/libs/test-ui-lib/dist",
        packageJson: "libs/test-ui-lib/package.json",
        main: "libs/test-ui-lib/src/index.css",
        assets: [
          "libs/test-ui-lib/*.md",
          { glob: "**/*", input: "libs/test-ui-lib/src", output: "./src" },
        ],
      },
    });
  });
});
