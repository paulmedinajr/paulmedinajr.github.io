//to run this on testnet:
// $ npx hardhat run scripts/deploy.js

async function deploy(name, ...params) {
  //deploy the contract
  const ContractFactory = await ethers.getContractFactory(name)
  const contract = await ContractFactory.deploy(...params)
  await contract.deployed()

  return contract
}

const contractURI = 'https://ipfs.io/ipfs/bafkreiel7ifk22wpw42lrpghar3h7nxqabychbupk5tjkltetqsciaouvu'
const tokenURI = 'https://www.polmedinajr.com/data/token'
const recipients = [
  '0xc742466fd430c852aaA5bbC936933A080B2ad4aB', //pol
  '0x594A0C367cDdCE0a0AC5031834780A72eDEfa0f7' //aod
];
const shares = [50, 50];

async function main() {
  await hre.run('compile')

  const nft = await deploy(
    'LegacyOfPolMedinaJr', 
    contractURI,
    tokenURI,
    recipients,
    shares
  )

  console.log('Token contract deployed to (update .env):', nft.address)
  console.log(
    'npx hardhat verify --show-stack-traces --constructor-args ./scripts/deploy-args.js --network', 
    process.env.BLOCKCHAIN_NETWORK, 
    nft.address
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0)).catch(error => {
  console.error(error)
  process.exit(1)
});