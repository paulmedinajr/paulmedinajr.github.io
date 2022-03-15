(async() => {
  const state = {}
  const contract = blockapi.contract('legacy')
  const connected = async function(newstate) {
    Object.assign(state, newstate, {})
    blockapi.notify('success', 'Wallet connected')

    document.getElementById('connected').classList.remove('hidden');
    document.getElementById('disconnected').classList.add('hidden');

    document.getElementById('wallet-address').innerHTML = [
      newstate.account.substr(0, 6),
      newstate.account.substr(newstate.account.length - 4)
    ].join('...')
  }

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
  window.addEventListener('disconnect-click', disconnected)
  window.addEventListener('connect-click', async(e) => {
    blockapi.connect(blockmetadata, connected, disconnected)
  })
  window.addEventListener('buy-click', async (e) => {
    async function buy() {
      const id = e.for.getAttribute('data-id')
      const price = e.for.getAttribute('data-price')
      const title = e.for.getAttribute('data-title')

      blockapi.notify(
        'info', 
        `Please confirm purchase of ${blockapi.toEther(price, 'string')} ethers ...`,
        1000000
      )

      let rpc;
      try {
        rpc = blockapi.send(
          contract, 
          state.account, 
          'buy(address,uint256,uint256)', 
          price, //value
          //args
          state.account, 
          parseInt(id), 
          1
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

      await rpc 
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
  
  const collections = document.getElementById('collections')
  const template = document.getElementById('template-collection')
  for (let token, i = 0; i < 2; i++) {
    token = null
    try {
      token = await blockapi.read(contract, 'tokenInfo', i + 1)
    } catch(e) {}
    
    if (!token?.price) break;
    const response = await fetch(`/token/${i + 1}.json`)
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
})()