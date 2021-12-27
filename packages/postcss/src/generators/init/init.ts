import {
  addDependenciesToPackageJson,
  convertNxGenerator,
  readJson,
  Tree,
} from "@nrwl/devkit";

function checkDependenciesInstalled(host: Tree) {
  const packageJson = readJson(host, "package.json");
  const devDependencies = {};
  const dependencies = {};
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};

  // if PostCSS is already installed, do NOT update it to the latest version
  if (
    !packageJson.devDependencies["postcss"] &&
    !packageJson.devDependencies["postcss-preset-env"]
  ) {
    devDependencies["postcss"] = "latest";
    devDependencies["postcss-preset-env"] = "latest";
  }

  return addDependenciesToPackageJson(host, dependencies, devDependencies);
}

export function initGenerator(tree: Tree) {
  return checkDependenciesInstalled(tree);
}

export default initGenerator;
export const initSchematic = convertNxGenerator(initGenerator);
