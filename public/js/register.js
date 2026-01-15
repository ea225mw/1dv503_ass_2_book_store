const firstName = document.querySelector('input[name="firstName"]')
const lastName = document.querySelector('input[name="lastName"]')
const address = document.querySelector('input[name="address"]')
const city = document.querySelector('input[name="city"]')
const zipCode = document.querySelector('input[name="zipCode"]')
const phone = document.querySelector('input[name="phone"]')
const email = document.querySelector('input[name="email"]')
const password = document.querySelector('input[name="password"]')

function autoFillTestData() {
  firstName.value = 'Emanuel'
  lastName.value = 'Andersen'
  address.value = 'Skvadronsbacken 61A'
  city.value = 'Sundbyberg'
  zipCode.value = '17456'
  phone.value = '0730521972'
  email.value = 'emanuel@andersen.se'
  password.value = 'Emanuel'
}

// autoFillTestData()