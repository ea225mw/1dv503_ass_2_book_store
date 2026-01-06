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

const template = document.createElement('template')
template.innerHTML = `
<tr>
  <td class="cart_isbn"></td>
    <td class="cart_title"></td>
      <td class="cart_qty"></td>
        <td class="cart_price"></td>
</tr>`

function updateCartTable(cart) {
  const cart_tbody = document.querySelector('#cart_tbody')
  cart_tbody.innerHTML = ''

  cart.forEach((book) => {
    const templateClone = template.content.cloneNode(true)
    const tr = templateClone.querySelector('tr')
    tr.querySelector('.cart_isbn').textContent = book.isbn
    tr.querySelector('.cart_title').textContent = book.title
    tr.querySelector('.cart_qty').textContent = book.qty
    tr.querySelector('.cart_price').textContent = book.price
    cart_tbody.append(templateClone)
  })

  document.querySelector('#totalPriceDiv').textContent = `Total price: ${cart[0].total_price} kr`
}
