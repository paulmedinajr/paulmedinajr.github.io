(async() => {
  const state = {}
  const contract = blockapi.contract('legacy')
  const collections = document.getElementById('collections')
  const template = document.getElementById('template-collection')
  //connected state
  const connected = async function(newstate) {
    Object.assign(state, newstate, {})
    blockapi.notify('success', 'Wallet connected')

    document.getElementById('connected').classList.remove('hidden');
    document.getElementById('disconnected').classList.add('hidden');

    document.getElementById('wallet-address').innerHTML = [
      newstate.account.substr(0, 6),
      newstate.account.substr(newstate.account.length - 4)
    ].join('...')

    //load collection
    collections.innerHTML = '';
    for (let token, i = 0; i < 4; i++) {
      token = null
      try {
        token = await blockapi.read(contract, 'tokenInfo', i + 1)
      } catch(e) {}
      
      if (!token?.price) break;
      const response = await fetch(`/data/token/${i + 1}.json`)
      const metadata = await response.json()

      const item = document.createElement('div')
      item.classList.add('collection')
      item.innerHTML = template.innerHTML
        .replace('{ID}', i + 1)
        .replace('{IMAGE}', metadata.image)
        .replace('{TITLE}', metadata.name)
        .replace('{DESCRIPTION}', metadata.description)
        .replace('{PRICE}', blockapi.toEther(token.price, 'string'))
        .replace('{MAXSUPPLY}', token.max)
        .replace('{REMAINING}', token.remaining)
        .replace('{ID}', i + 1)
        .replace('{TITLE}', metadata.name)
        .replace('{PRICE}', token.price)

      collections.appendChild(item)
      window.doon(item)
    }
  }
  //disconnected state
  const disconnected = function(e) {
    if (e?.message) {
      blockapi.notify('error', e.message)
    } else {
      blockapi.notify('success', 'Wallet disconnected')
    }

    document.getElementById('disconnected').classList.remove('hidden');
    document.getElementById('connected').classList.add('hidden');
  }

  window.doon('body')
  //on disconnect
  window.addEventListener('disconnect-click', disconnected)
  //on connect
  window.addEventListener('connect-click', async(e) => {
    blockapi.connect(blockmetadata, connected, disconnected)
  })
  //on buy
  window.addEventListener('buy-click', async (e) => {
    async function buy() {
      if (!whitelist[state.account.toLowerCase()]) {
        console.log(state.account.toLowerCase(), whitelist)
        return blockapi.notify('error', 'Wallet is not whitelisted')
      }

      const proof = whitelist[state.account.toLowerCase()]
      const id = e.for.getAttribute('data-id')
      const price = e.for.getAttribute('data-price')
      const title = e.for.getAttribute('data-title')

      blockapi.notify(
        'info', 
        `Please confirm purchase of ${blockapi.toEther(price, 'string')} ethers ...`
      )

      let rpc;
      try {
        rpc = blockapi.send(
          contract, 
          state.account, 
          'buy(address,uint256,uint256,bytes)', 
          price, //value
          //args
          state.account, 
          parseInt(id), 
          1,
          proof
        )
      } catch(e) {
        blockapi.notify('error', e.message)
        return
      }

      rpc.on('transactionHash', function(hash) {
        blockapi.notify(
          'success', 
          `Transaction started for "${title}" on <a class="text-blue-600 underline font-semibold" href="${blockmetadata.chain_scan}/tx/${hash}" target="_blank">
            etherscan.com
          </a>`,
          1000000
        )
      })

      rpc.on('confirmation', function(confirmationNumber, receipt) {
        if (confirmationNumber > 10) return
        blockapi.notify(
          'success', 
          `${confirmationNumber}/10 confirmed your "${title}" on <a class="text-blue-600 underline font-semibold" href="${blockmetadata.chain_scan}/tx/${receipt.transactionHash}" target="_blank">
            etherscan.com
          </a>`,
          1000000
        )
      })

      rpc.on('receipt', function(receipt) {
        blockapi.notify(
          'success', 
          `Please confirm "${title}" on <a class="text-blue-600 underline font-semibold" href="${blockmetadata.chain_scan}/tx/${receipt.transactionHash}" target="_blank">
            etherscan.com
          </a>`,
          1000000
        )
      })

      try {
        await rpc
      } catch(e) {
        blockapi.notify('error', e.message)
      }
    }
  
    if (!state.account) {
      blockapi.connect(blockmetadata, async (newstate) => {
        await connected(newstate)
        await buy()
      }, disconnected)
    } else {
      await buy()
    }
  })

  //load whitelist
  const response = await fetch(`/data/whitelist.json`)
  const whitelist = await response.json()
  
  
})()