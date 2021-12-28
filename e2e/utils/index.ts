import {
  ensureNxProject,
  patchPackageJsonForPlugin,
  runPackageManagerInstall,
} from "@nrwl/nx-plugin/testing";

type NpmPackage = [npmPackageName: string, pluginDistPath: string];
interface NewProjectParams {
  npmPackageName?: string;
  pluginDistPath?: string;
  optionalNpmPackages?: NpmPackage[];
}
export function newProject({
  npmPackageName,
  pluginDistPath,
  optionalNpmPackages = [],
}: NewProjectParams): void {
  ensureNxProject(npmPackageName, pluginDistPath);
  optionalNpmPackages.forEach(([npmPackageName, pluginDistPath]) =>
    patchPackageJsonForPlugin(npmPackageName, pluginDistPath)
  );
  runPackageManagerInstall();
}
