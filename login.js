;(async function () {
  let token
  async function login(data = {}) {
    const response = await fetch('http://localhost:3030/users/login', {
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
    const email = event.currentTarget.querySelector('#email').value
    const password = event.currentTarget.querySelector('#password').value

    const data = {
      email,
      password,
    }

    const userData = await login(data)
    localStorage.setItem('x-access-token', token)
    localStorage.setItem('user-data', JSON.stringify(userData))

    window.location = window.location.pathname.replace(
      'login.html',
      'index.html'
    )
  })
})()
