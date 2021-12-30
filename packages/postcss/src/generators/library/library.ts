import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  joinPathFragments,
  names,
  offsetFromRoot,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from "@nrwl/devkit";
import { libraryGenerator as workspaceLibraryGenerator } from "@nrwl/workspace/generators";
import { join } from "path";
import configurationGenerator from "../configuration/configuration";
import { Schema } from "./schema";

interface NormalizedSchema extends Schema {
  name: string;
  prefix: string;
  fileName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function getCaseAwareFileName(options: {
  pascalCaseFiles: boolean;
  fileName: string;
}) {
  const normalized = names(options.fileName);

  return options.pascalCaseFiles ? normalized.className : normalized.fileName;
}

function normalizeOptions(tree: Tree, options: Schema): NormalizedSchema {
  const { npmScope, libsDir } = getWorkspaceLayout(tree);
  const defaultPrefix = npmScope;
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;

  const projectName = projectDirectory.replace(new RegExp("/", "g"), "-");
  const fileName = getCaseAwareFileName({
    fileName: options.simpleModuleName ? name : projectName,
    pascalCaseFiles: options.pascalCaseFiles,
  });
  const projectRoot = joinPathFragments(libsDir, projectDirectory);

  const parsedTags = options.tags
    ? options.tags.split(",").map((s) => s.trim())
    : [];

  const importPath =
    options.importPath || `@${defaultPrefix}/${projectDirectory}`;

  return {
    ...options,
    prefix: defaultPrefix, // we could also allow customizing this
    fileName,
    name: projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    importPath,
  };
}

function createFiles(tree: Tree, options: NormalizedSchema) {
  const { className, name, propertyName } = names(options.fileName);

  generateFiles(tree, join(__dirname, "./files/lib"), options.projectRoot, {
    ...options,
    className,
    name,
    propertyName,
    tmpl: "",
    offsetFromRoot: offsetFromRoot(options.projectRoot),
  });

  tree.delete(
    join(options.projectRoot, `./src/lib/${options.fileName}.spec.ts`)
  );
  tree.delete(join(options.projectRoot, `./src/lib/${options.fileName}.ts`));
  tree.delete(join(options.projectRoot, "./src/index.ts"));
  tree.delete(join(options.projectRoot, "./.eslintrc.json"));
  tree.delete(join(options.projectRoot, "./jest.config.js"));
  tree.delete(join(options.projectRoot, "./tsconfig.json"));
  tree.delete(join(options.projectRoot, "./tsconfig.lib.json"));
  tree.delete(join(options.projectRoot, "./tsconfig.spec.json"));
  if (!options.publishable && !options.buildable) {
    tree.delete(join(options.projectRoot, "package.json"));
  }
}

function updateProject(tree: Tree, options: NormalizedSchema) {
  if (!options.publishable && !options.buildable) {
    return;
  }

  const project = readProjectConfiguration(tree, options.name);

  project.targets = project.targets || {};
  delete project.targets.lint;
  delete project.targets.test;

  updateProjectConfiguration(tree, options.name, project);
}

export async function libraryGenerator(tree: Tree, schema: Schema) {
  const options = normalizeOptions(tree, schema);

  if (options.publishable === true && !schema.importPath) {
    throw new Error(
      `For publishable libs you have to provide a proper "--importPath" which needs to be a valid npm package name (e.g. my-awesome-lib or @myorg/my-lib)`
    );
  }

  await workspaceLibraryGenerator(tree, {
    ...schema,
    importPath: options.importPath,
    skipBabelrc: true,
    skipFormat: true,
    skipTsConfig: true,
  });
  createFiles(tree, options);

  updateProject(tree, options);

  const installTask = await configurationGenerator(tree, {
    project: schema.name,
  });

  if (!schema.skipFormat) {
    await formatFiles(tree);
  }

  return installTask;
}

export default libraryGenerator;
export const librarySchematic = convertNxGenerator(libraryGenerator);
