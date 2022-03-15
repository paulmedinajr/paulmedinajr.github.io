//to run this on testnet:
// $ npx hardhat run scripts/whitelist.js

const fs = require('fs')
const path = require('path')
const hardhat = require('hardhat')
const whitelist = require('../data/whitelist.json')

function hashToken(recipient) {
  return Buffer.from(
    ethers.utils.solidityKeccak256(
      ['string', 'address'],
      ['authorized', recipient]
    ).slice(2),
    'hex'
  )
}

async function main() {
  //sign message wallet PK
  const wallet = hardhat.config.networks[hardhat.config.defaultNetwork].accounts[0]
  const signer = new ethers.Wallet(wallet)

  const whitelisted = {}
  //make a message
  for (let i = 0; i < whitelist.length; i++) {
    const message = hashToken(whitelist[i])
    const signature = await signer.signMessage(message)
    whitelisted[whitelist[i].toLowerCase()] = signature
  }

  //write to separate files
  fs.writeFileSync(
    path.resolve(__dirname, `../docs/data/whitelist.json`),
    JSON.stringify(whitelisted, null, 2)
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
})
