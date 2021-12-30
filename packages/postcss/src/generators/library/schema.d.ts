export interface Schema {
  name: string;
  buildable?: boolean;
  directory?: string;
  importPath?: string;
  pascalCaseFiles?: boolean;
  publishable?: boolean;
  rootDir?: string;
  simpleModuleName?: boolean;
  skipFormat?: boolean;
  tags?: string;
}
