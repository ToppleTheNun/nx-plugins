import { joinPathFragments, normalizePath } from "@nrwl/devkit";
import { ensureFile } from "fs-extra";
import { readFile, writeFile } from "fs/promises";
import postcss from "postcss";
import * as postcssrc from "postcss-load-config";
import { NormalizedPackageExecutorSchema } from "../schema";

export async function readAndCompileCss(
  options: NormalizedPackageExecutorSchema
) {
  const rawInputCss = await readFile(
    joinPathFragments(normalizePath(options.root), options.main),
    "utf-8"
  );

  const postcssrcConfig: postcssrc.ConfigContext = {
    cwd: normalizePath(options.projectRoot),
    env: "production",
    from: options.main,
    to: joinPathFragments(options.outputPath, options.outputFileName),
    map: options.sourceMap ?? { inline: true },
  };
  const { options: postcssOptions, plugins: postcssPlugins } = await postcssrc(
    postcssrcConfig,
    normalizePath(options.projectRoot)
  );
  const postcssResult = await postcss(postcssPlugins).process(
    rawInputCss,
    postcssOptions
  );

  const pathToOutputFile = joinPathFragments(
    normalizePath(options.root),
    options.outputPath,
    options.outputFileName
  );
  await ensureFile(pathToOutputFile);
  await writeFile(pathToOutputFile, postcssResult.css, "utf-8");
}
