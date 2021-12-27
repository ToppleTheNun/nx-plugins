export interface Schema {
  name: string;
  buildable?: boolean;
  directory?: string;
  publishable?: boolean;
  rootDir?: string;
  skipFormat?: boolean;
  tags?: string;
}
