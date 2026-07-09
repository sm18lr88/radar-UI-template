import typescriptMetadata from 'typescript/package.json' with { type: 'json' }

if (!typescriptMetadata.version.startsWith('7.')) {
  console.error(`TypeScript 7 is required; resolved ${typescriptMetadata.version}`)
  process.exit(1)
}

console.log(`TypeScript ${typescriptMetadata.version}`)
