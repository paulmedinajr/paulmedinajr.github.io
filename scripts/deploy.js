//to run this on testnet:
// $ npx hardhat run scripts/deploy.js

async function deploy(name, ...params) {
  //deploy the contract
  const ContractFactory = await ethers.getContractFactory(name)
  const contract = await ContractFactory.deploy(...params)
  await contract.deployed()

  return contract
}

const contractURI = 'https://ipfs.io/ipfs/bafkreicktn4jqck5ib4m2kv23h3md26ytgjyaoszeg5jup252j2daqrl5y'
const tokenURI = 'https://www.polmedinajr.com/token/${id}.json'
const recipients = [
  '0xc742466fd430c852aaA5bbC936933A080B2ad4aB', //pol
  '0x5CBFA0E4dE6934d3531D86F24a52e5e9Eb019786' //aod
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