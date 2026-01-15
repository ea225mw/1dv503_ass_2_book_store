let test
const invoiceTemplate = document.createElement('template')
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

const lineItemsTemplate = document.createElement('template')
lineItemsTemplate.innerHTML = `
<tr>
  <td class="invoiceISBN"></td>
  <td class="invoiceBookTitle"></td>
  <td class="invoiceBookPrice noLineBreak"></td>
  <td class="invoiceQuantity"></td>
  <td class="invoiceAmount noLineBreak"></td>
</tr>
`

const orderTable = document.querySelector('#ordersTable')

if (orderTable) {
  orderTable.addEventListener('click', async (event) => {
    checkIfAnInvoiceIsAlreadyDisplayed()

    const row = event.target.closest('tr')
    const response = await fetch('./order/getinvoice', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({orderNumber: row.dataset.ono}),
    })
    const invoiceData = await response.json();
    console.log(invoiceData);
    createSelectedInvoice(invoiceData)
    initCloseButton()
  })
}

function createSelectedInvoice(invoiceData) {
  const invoiceDiv = invoiceTemplate.content.cloneNode(true)

  invoiceDiv.querySelector('h1').textContent = `Invoice, order number ${invoiceData.orderNumber}`
  invoiceDiv.querySelector('.invoiceCreated').textContent = `${invoiceData.created}`
  invoiceDiv.querySelector('.invoiceDelivery').textContent = `${invoiceData.delivery}`
  invoiceDiv.querySelector('.invoiceName').textContent = `${invoiceData.fName} ${invoiceData.lName}`
  invoiceDiv.querySelector('.invoiceStreet').textContent = `${invoiceData.street}`
  invoiceDiv.querySelector('.invoiceZipAndCity').textContent = `${invoiceData.zip} ${invoiceData.city}`
  invoiceDiv.querySelector('#orderTotalDiv').textContent = `Order total: ${invoiceData.orderTotal} kr`

  invoiceData.lineItems.forEach((item) => {
    const tr = lineItemsTemplate.content.cloneNode(true)

    tr.querySelector('.invoiceISBN').textContent = item.isbn
    tr.querySelector('.invoiceBookTitle').textContent = item.title
    tr.querySelector('.invoiceBookPrice').textContent = `${item.price} kr`
    tr.querySelector('.invoiceQuantity').textContent = item.qty
    tr.querySelector('.invoiceAmount').textContent = `${item.amount} kr`
    invoiceDiv.querySelector('tbody').append(tr)
  })
document.querySelector('.ordersTableAndInvoiceDiv').append(invoiceDiv)
}

function initCloseButton() {
  test = document.querySelector('#closeInvoiceButton')
  test.addEventListener('click', () => {
    document.querySelector('#invoice').remove()
  })
}

function checkIfAnInvoiceIsAlreadyDisplayed() {
  const invoice = document.querySelector('#invoice')
  if (invoice) {
    invoice.remove()
  }
}