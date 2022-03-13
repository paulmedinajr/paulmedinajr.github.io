//to run this on testnet:
// $ node scripts/generate-metadata.js

const fs = require('fs')
const path = require('path')
const collections = require('../data/token-metadata.json')

async function main() {
  collections.forEach((metadata, i) => {
    //write to separate files
    fs.writeFileSync(
      path.resolve(__dirname, `../docs/token/${i + 1}.json`),
      JSON.stringify(metadata, null, 2)
    )
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
});