const orderTable = document.querySelector('#ordersTable')

if (orderTable) {
  orderTable.addEventListener('click', async (event) => {
    const row = event.target.closest('tr')
    await fetch('./order/getinvoice', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({orderNumber: row.dataset.ono}),
    })
  })
}
