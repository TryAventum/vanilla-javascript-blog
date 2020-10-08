;(async function () {
  let currentUser = JSON.parse(localStorage.getItem('user-data'))
  async function profile(data = {}) {
    const response = await fetch('http://localhost:3030/users/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('x-access-token'),
      },
      body: JSON.stringify(data),
    })

    return response.json()
  }

  const form = document.querySelector('form')
  document.querySelector('#firstName').value = currentUser.firstName
  document.querySelector('#lastName').value = currentUser.lastName
  document.querySelector('#email').value = currentUser.email
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

    const userData = await profile(data)

    localStorage.setItem('user-data', JSON.stringify(userData.user))

    window.location = window.location.pathname.replace(
      'profile.html',
      'index.html'
    )
  })
})()
