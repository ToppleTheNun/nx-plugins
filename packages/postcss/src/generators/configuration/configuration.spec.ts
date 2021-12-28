import { readProjectConfiguration, Tree } from "@nrwl/devkit";
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

  it("should generate files", async () => {
    await configurationGenerator(tree, { name: "test-ui-lib" });

    expect(tree.exists("libs/test-ui-lib/postcss.config.js")).toBeTruthy();
  });

  describe("is publishable", () => {
    it("should update workspace file", async () => {
      await configurationGenerator(tree, {
        name: "test-ui-lib",
        publishable: true,
      });
      const project = readProjectConfiguration(tree, "test-ui-lib");

      expect(project.targets.build).toEqual({
        executor: "@topplethenun/nx-plugin-postcss:package",
        outputs: ["{options.outputPath}"],
        options: {
          outputPath: "dist/libs/test-ui-lib",
          packageJson: "libs/test-ui-lib/package.json",
          main: "libs/test-ui-lib/src/index.css",
          assets: ["libs/test-ui-lib/*.md"],
        },
      });
    });
  });

  describe("is buildable", () => {
    it("should update workspace file", async () => {
      await configurationGenerator(tree, {
        name: "test-ui-lib",
        buildable: true,
      });
      const project = readProjectConfiguration(tree, "test-ui-lib");

      expect(project.targets.build).toEqual({
        executor: "@topplethenun/nx-plugin-postcss:package",
        outputs: ["{options.outputPath}"],
        options: {
          outputPath: "dist/libs/test-ui-lib",
          packageJson: "libs/test-ui-lib/package.json",
          main: "libs/test-ui-lib/src/index.css",
          assets: ["libs/test-ui-lib/*.md"],
        },
      });
    });
  });

  describe("is not buildable and not publishable", () => {
    it("should not update workspace file", async () => {
      await configurationGenerator(tree, {
        name: "test-ui-lib",
      });
      const project = readProjectConfiguration(tree, "test-ui-lib");

      expect(project.targets.build).toBeUndefined();
    });
  });
});
