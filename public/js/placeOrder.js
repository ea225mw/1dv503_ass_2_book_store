const placeOrderButton = document.querySelector('#placeOrderButton')

if (placeOrderButton) {
  placeOrderButton.addEventListener('click', async () => {
    const response = await fetch('./order', {
      method: 'POST',
    })
  })
}
