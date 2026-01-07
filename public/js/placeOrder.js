const placeOrderButton = document.querySelector('#placeOrderButton')

if (placeOrderButton) {
  placeOrderButton.addEventListener('click', async () => {
    await fetch('./order', {
      method: 'POST',
    })
  })
}
