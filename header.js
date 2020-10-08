;(async function () {
  const header = document.createElement('header')
  const ul = document.createElement('ul')
  header.appendChild(ul)

  const pathParts = window.location.pathname.split('/')
  const currentPage = pathParts[pathParts.length - 1]

  const renderHeader = async () => {
    const currentUser = await getCurrentUser()

    ul.innerHTML = ''

    let routes = [
      {
        label: 'Home',
        href: window.location.pathname.replace(currentPage, 'index.html'),
      },
    ]

    if (currentUser) {
      routes.push({
        label: 'Profile',
        href: window.location.pathname.replace(currentPage, 'profile.html'),
      })
      routes.push({
        label: 'Logout',
        id: 'logout-btn',
        href: '#',
      })
    } else {
      routes.push({
        label: 'Login',
        href: window.location.pathname.replace(currentPage, 'login.html'),
      })
      routes.push({
        label: 'Register',
        href: window.location.pathname.replace(
          currentPage,
          'registration.html'
        ),
      })
    }

    for (const route of routes) {
      const link = document.createElement('a')
      link.href = route.href
      if (route.id) {
        link.setAttribute('id', route.id)
      }
      const li = document.createElement('li')
      li.textContent = route.label
      link.appendChild(li)
      ul.appendChild(link)
    }
  }

  await renderHeader()

  document.body.insertBefore(header, document.body.firstChild)

  if (document.querySelector('#logout-btn')) {
    document.querySelector('#logout-btn').addEventListener('click', (event) => {
      event.preventDefault()
      logTheUserOut()
    })
  }
})()
