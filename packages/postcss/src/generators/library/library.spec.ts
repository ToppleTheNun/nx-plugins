import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import libraryGenerator from "./library";

describe("@topplethenun/nx-plugin-postcss:library", () => {
  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
  });

  it("should generate files", async () => {
    await libraryGenerator(tree, {
      name: "test-ui-lib",
    });
    expect(tree.exists("libs/test-ui-lib/postcss.config.js")).toBeTruthy();
    expect(tree.exists("libs/test-ui-lib/.babelrc")).toBeFalsy();
    expect(tree.exists("libs/test-ui-lib/.eslintrc")).toBeFalsy();
    expect(tree.exists("libs/test-ui-lib/package.json")).toBeFalsy();
  });

  it("generates a package.json when publishable", async () => {
    await libraryGenerator(tree, {
      name: "test-ui-lib",
      importPath: "@topplethenun/test-ui-lib",
      publishable: true,
    });
    expect(tree.exists("libs/test-ui-lib/postcss.config.js")).toBeTruthy();
    expect(tree.exists("libs/test-ui-lib/.babelrc")).toBeFalsy();
    expect(tree.exists("libs/test-ui-lib/.eslintrc")).toBeFalsy();
    expect(tree.exists("libs/test-ui-lib/package.json")).toBeTruthy();
  });
});
