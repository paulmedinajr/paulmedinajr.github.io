const { expect } = require('chai');
require('dotenv').config()

if (process.env.BLOCKCHAIN_NETWORK != 'hardhat') {
  console.error('Exited testing with network:', process.env.BLOCKCHAIN_NETWORK)
  process.exit(1);
}

async function deploy(name, ...params) {
  //deploy the contract
  const ContractFactory = await ethers.getContractFactory(name)
  const contract = await ContractFactory.deploy(...params)
  await contract.deployed()

  return contract
}

async function getSigners(name, ...params) {
  //deploy the contract
  const contract = await deploy(name, ...params)
  
  //get the signers
  const signers = await ethers.getSigners()
  //attach contracts
  for (let i = 0; i < signers.length; i++) {
    const Contract = await ethers.getContractFactory(name, signers[i])
    signers[i].withContract = await Contract.attach(contract.address)
  }

  return signers
}

describe('LegacyOfPolMedinaJr Tests', function () {
  before(async function() {

    const signers = await ethers.getSigners()

    this.contractURI = 'https://ipfs.io/ipfs/bafkreicktn4jqck5ib4m2kv23h3md26ytgjyaoszeg5jup252j2daqrl5y'
    this.tokenURI = 'https://www.polmedinajr.com/token/${id}.json'
    this.recipients = [
      signers[3].address,
      signers[4].address
    ];
    this.shares = [50, 50];

    const [ 
      owner, 
      holder1, 
      holder2
    ] = await getSigners(
      'LegacyOfPolMedinaJr',
      this.contractURI,
      this.tokenURI,
      this.recipients,
      this.shares 
    )

    this.signers = {
      owner, 
      holder1, 
      holder2
    }
  })

  it('Should add tokens', async function () {
    const { owner } = this.signers
    await owner.withContract.addToken(1, 20, ethers.utils.parseEther('0.06'))
    await owner.withContract.addToken(2, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(3, 70, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(4, 40, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(5, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(6, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(7, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(8, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(9, 10, ethers.utils.parseEther('0.15'))
    await owner.withContract.addToken(10, 60, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(11, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(12, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(13, 70, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(14, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(15, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(16, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(17, 20, ethers.utils.parseEther('0.06'))
    await owner.withContract.addToken(18, 70, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(19, 70, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(20, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(21, 50, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(22, 70, ethers.utils.parseEther('0.05'))
    await owner.withContract.addToken(23, 1, ethers.utils.parseEther('0.3'))
    await owner.withContract.addToken(24, 1, ethers.utils.parseEther('0.3'))
    await owner.withContract.addToken(25, 1, ethers.utils.parseEther('0.3'))
    await owner.withContract.addToken(26, 1, ethers.utils.parseEther('0.3'))
    await owner.withContract.addToken(27, 1, ethers.utils.parseEther('0.3'))
    await owner.withContract.addToken(28, 1, ethers.utils.parseEther('0.6'))
    await owner.withContract.addToken(29, 1, ethers.utils.parseEther('1'))
    await owner.withContract.addToken(30, 1, ethers.utils.parseEther('1.2'))
    await owner.withContract.addToken(31, 1, ethers.utils.parseEther('1.2'))
    await owner.withContract.addToken(32, 1, 0)
    await owner.withContract.addToken(33, 1, 0)
    await owner.withContract.addToken(34, 0, 0)

    expect(await owner.withContract.maxSupply(1)).to.equal(20)
    expect(await owner.withContract.maxSupply(2)).to.equal(50)
    expect(await owner.withContract.maxSupply(3)).to.equal(70)
    expect(await owner.withContract.maxSupply(4)).to.equal(40)
    expect(await owner.withContract.maxSupply(5)).to.equal(50)
    expect(await owner.withContract.maxSupply(6)).to.equal(50)
    expect(await owner.withContract.maxSupply(7)).to.equal(50)
    expect(await owner.withContract.maxSupply(8)).to.equal(50)
    expect(await owner.withContract.maxSupply(9)).to.equal(10)
    expect(await owner.withContract.maxSupply(10)).to.equal(60)
    expect(await owner.withContract.maxSupply(11)).to.equal(50)
    expect(await owner.withContract.maxSupply(12)).to.equal(50)
    expect(await owner.withContract.maxSupply(13)).to.equal(70)
    expect(await owner.withContract.maxSupply(14)).to.equal(50)
    expect(await owner.withContract.maxSupply(15)).to.equal(50)
    expect(await owner.withContract.maxSupply(16)).to.equal(50)
    expect(await owner.withContract.maxSupply(17)).to.equal(20)
    expect(await owner.withContract.maxSupply(18)).to.equal(70)
    expect(await owner.withContract.maxSupply(19)).to.equal(70)
    expect(await owner.withContract.maxSupply(20)).to.equal(50)
    expect(await owner.withContract.maxSupply(21)).to.equal(50)
    expect(await owner.withContract.maxSupply(22)).to.equal(70)
    expect(await owner.withContract.maxSupply(23)).to.equal(1)
    expect(await owner.withContract.maxSupply(24)).to.equal(1)
    expect(await owner.withContract.maxSupply(25)).to.equal(1)
    expect(await owner.withContract.maxSupply(26)).to.equal(1)
    expect(await owner.withContract.maxSupply(27)).to.equal(1)
    expect(await owner.withContract.maxSupply(28)).to.equal(1)
    expect(await owner.withContract.maxSupply(29)).to.equal(1)
    expect(await owner.withContract.maxSupply(30)).to.equal(1)
    expect(await owner.withContract.maxSupply(31)).to.equal(1)
    expect(await owner.withContract.maxSupply(32)).to.equal(1)
    expect(await owner.withContract.maxSupply(33)).to.equal(1)
    expect(await owner.withContract.maxSupply(34)).to.equal(0)

    expect(await owner.withContract.mintPrice(1)).to.equal(ethers.utils.parseEther('0.06'))
    expect(await owner.withContract.mintPrice(2)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(3)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(4)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(5)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(6)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(7)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(8)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(9)).to.equal(ethers.utils.parseEther('0.15'))
    expect(await owner.withContract.mintPrice(10)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(11)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(12)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(13)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(14)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(15)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(16)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(17)).to.equal(ethers.utils.parseEther('0.06'))
    expect(await owner.withContract.mintPrice(18)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(19)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(20)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(21)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(22)).to.equal(ethers.utils.parseEther('0.05'))
    expect(await owner.withContract.mintPrice(23)).to.equal(ethers.utils.parseEther('0.3'))
    expect(await owner.withContract.mintPrice(24)).to.equal(ethers.utils.parseEther('0.3'))
    expect(await owner.withContract.mintPrice(25)).to.equal(ethers.utils.parseEther('0.3'))
    expect(await owner.withContract.mintPrice(26)).to.equal(ethers.utils.parseEther('0.3'))
    expect(await owner.withContract.mintPrice(27)).to.equal(ethers.utils.parseEther('0.3'))
    expect(await owner.withContract.mintPrice(28)).to.equal(ethers.utils.parseEther('0.6'))
    expect(await owner.withContract.mintPrice(29)).to.equal(ethers.utils.parseEther('1'))
    expect(await owner.withContract.mintPrice(30)).to.equal(ethers.utils.parseEther('1.2'))
    expect(await owner.withContract.mintPrice(31)).to.equal(ethers.utils.parseEther('1.2'))
    expect(await owner.withContract.mintPrice(32)).to.equal(0)
    expect(await owner.withContract.mintPrice(33)).to.equal(0)
    expect(await owner.withContract.mintPrice(34)).to.equal(0)
  })

  it('Should mint', async function () {
    const { owner, holder1 } = this.signers

    await owner.withContract.mint(holder1.address, 1, 2)
    expect(await owner.withContract.balanceOf(holder1.address, 1)).to.equal(2)
    expect(await owner.withContract.remainingSupply(1)).to.equal(18)
  })

  it('Should not mint', async function () {
    const { owner, holder1 } = this.signers

    await expect(owner.withContract.mint(holder1.address, 35, 2)).to.revertedWith('InvalidMint()')
  })

  it('Should buy', async function () {
    const { owner, holder2 } = this.signers
    await owner.withContract.buy(holder2.address, 2, 3, { value: ethers.utils.parseEther('0.15') })
    expect(await owner.withContract.balanceOf(holder2.address, 2)).to.equal(3)
  })

  it('Should not buy', async function () {
    const { owner, holder2 } = this.signers

    //wrong amount
    await expect(
      owner.withContract.buy(holder2.address, 3, 4, { 
        value: ethers.utils.parseEther('0.04') 
      })
    ).to.revertedWith('InvalidMint()')

    //wrong amount
    await expect(
      owner.withContract.buy(holder2.address, 3, 4, { 
        value: ethers.utils.parseEther('0.05') 
      })
    ).to.revertedWith('InvalidMint()')

    //passed max
    await expect(
      owner.withContract.buy(holder2.address, 3, 71, { 
        value: ethers.utils.parseEther('10') 
      })
    ).to.revertedWith('InvalidMint()')

    //no id
    await expect(
      owner.withContract.buy(holder2.address, 35, 4, { 
        value: ethers.utils.parseEther('0.04') 
      })
    ).to.revertedWith('InvalidMint()')
  })

  it('Should withdraw', async function () {
    const { owner } = this.signers

    const startingBalance = parseFloat(
      ethers.utils.formatEther(await owner.getBalance())
    )

    await owner.withContract['withdraw(address)'](owner.address)
    
    expect(parseFloat(
      ethers.utils.formatEther(await owner.getBalance())
      //also less gas
    ) - startingBalance).to.be.above(0.14)
  })
})