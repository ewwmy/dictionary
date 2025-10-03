export enum ImportOverwriteType {
  // overwrite duplicates
  Yes = 'yes',

  // merge duplicates
  Merge = 'merge',

  // ignore duplicates (no overwrite)
  Ignore = 'ignore',

  // error on duplicate
  Error = 'error',
}
