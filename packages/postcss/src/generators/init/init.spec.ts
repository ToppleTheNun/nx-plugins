import { addDependenciesToPackageJson, readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import initGenerator from "./init";

describe("@topplethenun/nx-plugin-postcss:init", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
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

      await initGenerator(tree);

      const packageJson = readJson(tree, "package.json");
      expect(packageJson).toMatchSnapshot();

      expect(packageJson.devDependencies["postcss"]).toBeDefined();
      expect(packageJson.devDependencies["postcss"]).toEqual("latest");
      expect(packageJson.devDependencies["postcss-preset-env"]).toEqual(
        "latest"
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

      await initGenerator(tree);

      const packageJson = readJson(tree, "package.json");
      expect(packageJson).toMatchSnapshot();

      expect(packageJson.devDependencies["postcss"]).toBeDefined();
      expect(packageJson.devDependencies["postcss"]).toEqual("7");
      expect(packageJson.devDependencies["postcss-preset-env"]).toBeUndefined();
    });
  });
});
