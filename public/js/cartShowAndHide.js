const showCartNavHeader = document.querySelector('#showCartNavHeader')
const hideCartButton = document.querySelector('#cartHeaderDiv button')
const cartContainer = document.querySelector('#cartContainer')

if (showCartNavHeader) {
  showCartNavHeader.addEventListener('click', () => {
    cartContainer.classList.toggle('visible')
  })
}

if (hideCartButton) {
  hideCartButton.addEventListener('click', () => {
    cartContainer.classList.toggle('visible')
  })
}
