(async () => {
  const form = document.getElementById('google-form')
  const frame = document.getElementById('google-frame')
  const success = document.getElementById('success')
  const button = form.querySelector('button')
  const wallet = form.querySelector('input.input-wallet')
  const twitter = form.querySelector('input.input-twitter')
  const discord = form.querySelector('input.input-discord')
  let submitted = false

  const submitable = function() {
    const hasSocial = twitter.value.length || discord.value.length
    if (!submitted && wallet.value.length && hasSocial) {
      if (whitelist[wallet.value.toLowerCase()]) {
        button.disabled = true
        blockapi.notify('error', 'Wallet is already whitelisted')
      } else {
        button.disabled = false
      }
    } else {
      button.disabled = true
    }
  }

  wallet.addEventListener('keyup', () => setTimeout(() => {
    //check whitelist
    button.disabled = true
    if (whitelist[wallet.value.toLowerCase()]) {
      blockapi.notify('error', 'Wallet is already whitelisted')
    } else {
      submitable()
    }
  }, 0))
  twitter.addEventListener('keyup', () => setTimeout(submitable, 0))
  discord.addEventListener('keyup', () => setTimeout(submitable, 0))
  
  form.addEventListener('submit', () => {
    submitted = true
    button.disabled = true
    button.innerText = 'Working...'
  })
  
  let loaded = 0
  frame.addEventListener('load', () => {
    if (loaded++ > 0) {
      button.parentElement.removeChild(button)
      success.style.display = 'block'
    }
  })

  //load whitelist
  const response = await fetch(`/data/whitelist.json`)
  const whitelist = await response.json()
})()