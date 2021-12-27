import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from "@nrwl/devkit";
import * as path from "path";
import init from "../init/init";
import { Schema } from "./schema";

interface NormalizedSchema extends Schema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp("/", "g"), "-");
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(",").map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: "",
  };
  generateFiles(
    tree,
    path.join(__dirname, "files"),
    options.projectRoot,
    templateOptions
  );
}

function updateProject(tree: Tree, options: NormalizedSchema) {
  if (!options.publishable && !options.buildable) {
    return;
  }

  const project = readProjectConfiguration(tree, options.name);
  const { libsDir } = getWorkspaceLayout(tree);

  project.targets = project.targets || {};
  project.targets.build = {
    executor: "@topplethenun/nx-plugin-postcss:package",
    outputs: ["{options.outputPath}"],
    options: {
      outputPath: `dist/${libsDir}/${options.projectDirectory}`,
      packageJson: `${options.projectRoot}/package.json`,
      main: `${options.projectRoot}/src/index.css`,
      assets: [`${options.projectRoot}/*.md`],
    },
  };

  if (options.rootDir) {
    project.targets.build.options.srcRootForCompilationRoot = options.rootDir;
  }

  updateProjectConfiguration(tree, options.name, project);
}

export default async function (tree: Tree, options: Schema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const installTask = init(tree);
  addFiles(tree, normalizedOptions);

  updateProject(tree, normalizedOptions);

  if (!options.skipFormat) {
    await formatFiles(tree);
  }

  return installTask;
}
