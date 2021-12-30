import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  normalizePath,
  readJson,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from "@nrwl/devkit";
import * as path from "path";
import { Schema } from "./schema";

function addFiles(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);

  const templateOptions = {
    template: "",
  };
  generateFiles(
    tree,
    path.join(__dirname, "files"),
    projectConfig.root,
    templateOptions
  );
}

function updateProject(tree: Tree, options: Schema) {
  const projectConfig = readProjectConfiguration(tree, options.project);
  const { libsDir } = getWorkspaceLayout(tree);

  projectConfig.targets = projectConfig.targets || {};
  projectConfig.targets.build = {
    executor: "@topplethenun/nx-plugin-postcss:package",
    outputs: ["{options.outputPath}"],
    options: {
      outputPath: `dist/${libsDir}/${options.project}`,
      packageJson: joinPathFragments(
        normalizePath(projectConfig.root),
        "package.json"
      ),
      main: joinPathFragments(
        normalizePath(projectConfig.root),
        "src",
        "index.css"
      ),
      assets: [joinPathFragments(normalizePath(projectConfig.root), "*.md")],
    },
  };

  updateProjectConfiguration(tree, options.project, projectConfig);
}

function checkDependenciesInstalled(host: Tree) {
  const packageJson = readJson(host, "package.json");
  const devDependencies = {};
  const dependencies = {};
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  // if PostCSS is already installed, do NOT update it to the latest version
  if (!packageJson.devDependencies["postcss"]) {
    devDependencies["postcss"] = "^8.0.0";
  }
  if (!packageJson.devDependencies["postcss-preset-env"]) {
    devDependencies["postcss-preset-env"] = "^7.0.0";
  }
  if (!packageJson.devDependencies["postcss-load-config"]) {
    devDependencies["postcss-load-config"] = "^3.0.0";
  }

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

export async function configurationGenerator(tree: Tree, options: Schema) {
  const installTask = checkDependenciesInstalled(tree);
  addFiles(tree, options);
  updateProject(tree, options);
  return installTask;
}

export default configurationGenerator;
export const configurationSchematic = convertNxGenerator(
  configurationGenerator
);
