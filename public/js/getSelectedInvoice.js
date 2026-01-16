import { invoiceTemplate, lineItemsTemplate } from "./templates.js"

let closeInvoiceButton

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
    createSelectedInvoice(invoiceData)
    initCloseButton()
  })
}

function createSelectedInvoice(invoiceData) {
  const invoiceDiv = invoiceTemplate.content.cloneNode(true)

  invoiceDiv.querySelector('h1').textContent = `Invoice, order number ${invoiceData.orderNumber}`
  invoiceDiv.querySelector('.invoiceCreated').textContent = `${invoiceData.created}`
  invoiceDiv.querySelector('.invoiceDelivery').textContent = `${invoiceData.delivery}`
  invoiceDiv.querySelector('.invoiceName').textContent = `${invoiceData.fname} ${invoiceData.lname}`
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
  closeInvoiceButton = document.querySelector('#closeInvoiceButton')
  closeInvoiceButton.addEventListener('click', () => {
    document.querySelector('#invoice').remove()
  })
}

function checkIfAnInvoiceIsAlreadyDisplayed() {
  const invoice = document.querySelector('#invoice')
  if (invoice) {
    invoice.remove()
  }
}