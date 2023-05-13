export const removeImportStatements = (source: string) =>
  source.replaceAll(/^import.*$/gm, "").trim();
