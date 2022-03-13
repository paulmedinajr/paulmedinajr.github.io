(async() => {
  const state = {}
  const connected = async function(newstate) {
    Object.assign(state, newstate, {})
    blockapi.notify('success', 'Wallet connected')

    console.log('connected')

    document.getElementById('connected').classList.remove('hidden');
    document.getElementById('disconnected').classList.add('hidden');

    document.getElementById('wallet-address').innerHTML = [
      newstate.account.substr(0, 6),
      newstate.account.substr(newstate.account.length - 4)
    ].join('...')

    console.log(state)
  }

  const disconnected = function(e) {
    if (e?.message) {
      blockapi.notify('error', e.message)
    } else {
      blockapi.notify('success', 'Wallet disconnected')
    }

    document.getElementById('disconnected').classList.remove('hidden');
    document.getElementById('connected').classList.add('hidden');

    document.getElementById('wallet-address').innerHTML = [
      newstate.account.substr(0, 6),
      newstate.account.substr(newstate.account.length - 4)
    ].join('...')
  }

  window.doon('body')
  window.addEventListener('disconnect-click', disconnected)
  window.addEventListener('connect-click', async(e) => {
    blockapi.connect(blockmetadata, connected, disconnected)
  })
  
  const collections = document.getElementById('collections')
  const template = document.getElementById('template-collection')
  const contract = blockapi.contract('legacy')
  for (let token, i = 0; i < 34; i++) {
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
      .replace('{IMAGE}', metadata.image)
      .replace('{TITLE}', metadata.name)
      .replace('{DESCRIPTION}', metadata.description)
      .replace('{PRICE}', blockapi.toEther(token.price, 'string'))
      .replace('{MAXSUPPLY}', token.max)
      .replace('{REMAINING}', token.remaining)

    collections.appendChild(item)
  }
})()