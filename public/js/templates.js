export const cartRowTemplate = document.createElement('template')
cartRowTemplate.innerHTML = `
<tr>
  <td class="cart_isbn"></td>
  <td class="cart_title"></td>
  <td class="cart_price"></td>
  <td class="cart_qty"></td>
  <td class="cart_sum"></td>
</tr>`

export const cartTableTemplate = document.createElement('template')
cartTableTemplate.innerHTML = `
<table>
  <thead>
    <th>ISBN</th>
    <th>Title</th>
    <th>Price</th>
    <th>Quantity</th>
    <th>Sum</th>
  </thead>
  <tbody id="cart_tbody">
  </tbody>
</table>
`

export const totalPriceDivTemplate = document.createElement('template')
totalPriceDivTemplate.innerHTML = `
<div id="totalPriceDiv"></div>
<form action="./order" method="post">
  <button type="submit" id="placeOrderButton">Place order</button>
</form>
`
