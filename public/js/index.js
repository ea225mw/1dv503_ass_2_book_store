import { cartRowTemplate, cartTableTemplate, totalPriceDivTemplate  } from "./templates.js"

let cart_tbody

const emailInput = document.querySelector('input[name="email"]')
if (emailInput) emailInput.focus()

const allAddToCartButtons = document.querySelectorAll('.addToCartButton')

allAddToCartButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    sendDataToCart(event)
  })
})

async function sendDataToCart(event) {
  const quantityDiv = event.target.closest('.quantityDiv')
  const quantityInput = quantityDiv.querySelector('.quantity')
  const bookContainer = event.target.closest('.bookContainer')
  const isbn = bookContainer.querySelector('.isbn')

  const response = await fetch('./cart', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      isbn: isbn.textContent.trim(),
      quantity: quantityInput.value,
    }),
  })

  const cart = await response.json()

  updateCartTable(cart)
}

function updateCartTable(cart) {
  cart_tbody = document.querySelector('#cart_tbody')

  if (!cart_tbody) {
    createCartTableIfNotPresent()
  }

  cart_tbody.innerHTML = ''

  cart.forEach((book) => {
    const row = cartRowTemplate.content.cloneNode(true)
    const tr = row.querySelector('tr')
    tr.querySelector('.cart_isbn').textContent = book.isbn
    tr.querySelector('.cart_title').textContent = book.title
    tr.querySelector('.cart_price').textContent = book.price + ' kr'
    tr.querySelector('.cart_qty').textContent = book.qty
    tr.querySelector('.cart_sum').textContent = book.line_total + ' kr'
    cart_tbody.append(row)
  })

  document.querySelector('#totalPriceDiv').textContent = `Total price: ${cart[0].total_price} kr`
  checkCartVisibility()
}

function createCartTableIfNotPresent() {
  const cartTable = cartTableTemplate.content.cloneNode(true)
  document.querySelector('#noItemsInCartDiv').remove()
  document.querySelector('#cartTableWrapper').append(cartTable)
  cart_tbody = document.querySelector('#cart_tbody')

  const totalPriceDiv = totalPriceDivTemplate.content.cloneNode(true)
  document.querySelector('#cartContainer').append(totalPriceDiv)
}

function checkCartVisibility() {
  const cartContainer = document.querySelector('#cartContainer')
  if (!cartContainer.classList.contains('visible')) {
    cartContainer.classList.toggle('visible')
  }
}

const closeInvoiceButton = document.querySelector('#closeInvoiceButton')

if (closeInvoiceButton) {
  closeInvoiceButton.addEventListener('click', () => {
    document.querySelector('#invoice').remove()
  })
}
