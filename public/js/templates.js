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

export const invoiceTemplate = document.createElement('template')
invoiceTemplate.innerHTML = `
<div id="invoice">
  <div id="invoiceHeaderDiv">
    <h1></h1>
    <button type="button" id="closeInvoiceButton">Close</button>
  </div>
  <h2>Order date:</h2>
  <ul>
    <li class="invoiceCreated"></li>
  </ul>
  <h2>Estimated delivery:</h2>
  <ul>
    <li class="invoiceDelivery"></li>
  </ul>
  <h2>Shipping address:</h2>
  <ul>
    <li class="invoiceName"></li>
    <li class="invoiceStreet"></li>
    <li class="invoiceZipAndCity"></li>
  </ul>
  <h2>Order:</h2>
  <table>
    <thead>
      <tr>
        <th>ISBN</th>
        <th>Title</th>
        <th>Unit price</th>
        <th class="centeredColumn">Quantity</th>
        <th>Sum</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
  <div id="orderTotalDiv"></div>
</div>`

export const lineItemsTemplate = document.createElement('template')
lineItemsTemplate.innerHTML = `
<tr>
  <td class="invoiceISBN"></td>
  <td class="invoiceBookTitle"></td>
  <td class="invoiceBookPrice noLineBreak"></td>
  <td class="invoiceQuantity"></td>
  <td class="invoiceAmount noLineBreak"></td>
</tr>
`