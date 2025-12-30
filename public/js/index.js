const registerForm = document.querySelector('#registerForm')
const allInputFields = document.querySelectorAll('#registerForm > input')
const registerFormSubmitButton = document.querySelector('#registerButton')

const firstName = document.querySelector('input[name="firstName"]')
const lastName = document.querySelector('input[name="lastName"]')
const address = document.querySelector('input[name="address"]')
const city = document.querySelector('input[name="city"]')
const zipCode = document.querySelector('input[name="zipCode"]')
const phone = document.querySelector('input[name="phone"]')
const email = document.querySelector('input[name="email"]')
const password = document.querySelector('input[name="password"]')

function checkInputFields() {
  allInputFields.forEach((inputField) => {
    if (inputField.value === '') {
      inputField.dataset.valid = 'false'
    } else {
      inputField.dataset.valid = 'true'
    }
  })
}

registerFormSubmitButton.addEventListener('click', async (event) => {
  event.preventDefault()

  checkInputFields()

  const isSomeFieldInvalid = [...allInputFields].some((inputField) => inputField.dataset.valid === 'false')

  if (isSomeFieldInvalid) {
    console.log('Invalid fields!')
  } else {
    const response = await fetch('./register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        zipCode: zipCode.value,
        phone: phone.value,
        email: email.value,
        password: password.value,
      }),
    })
    console.log(response)
    if (!response.ok) {
      if (response.status === 409) {
        console.log('Email already registered.')
      }
    }
  }
})
