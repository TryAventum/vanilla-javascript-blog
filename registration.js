;(async function () {
  let token
  async function registration(data = {}) {
    const response = await fetch('http://localhost:3030/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    token = response.headers.get('x-access-token')

    return response.json()
  }

  const form = document.querySelector('form')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const firstName = event.currentTarget.querySelector('#firstName').value
    const lastName = event.currentTarget.querySelector('#lastName').value
    const email = event.currentTarget.querySelector('#email').value
    const password = event.currentTarget.querySelector('#password').value
    const passwordConfirmation = event.currentTarget.querySelector(
      '#passwordConfirmation'
    ).value

    const data = {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    }

    const userData = await registration(data)
    localStorage.setItem('x-access-token', token)
    localStorage.setItem('user-data', JSON.stringify(userData))

    window.location = window.location.pathname.replace(
      'registration.html',
      'index.html'
    )
  })
})()
