var currentUser = undefined

async function getCurrentUser() {
  //Fetch current user data
  async function getUser() {
      try {
          const response = await fetch(`http://localhost:3030/users/me`, {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': localStorage.getItem('x-access-token')
            },
          })

          if(response.status === 200){
              return response.json() // parses JSON response into native JavaScript objects
          }

          return null
      } catch (error) {
          return null
      }
  }


  if(currentUser === undefined){
    if(localStorage.getItem('x-access-token') && localStorage.getItem('user-data')){
      const curUsr = await getUser()
    
      if(!curUsr){
        localStorage.removeItem('user-data')
        localStorage.removeItem('x-access-token')
        currentUser = null

        return currentUser
      }else{
        currentUser = curUsr

        return currentUser
      }
    }else{
      currentUser = null

      return currentUser
    }
  }

  return currentUser
}

function logTheUserOut() {
  localStorage.removeItem('user-data')
  localStorage.removeItem('x-access-token')
  currentUser = null
  location.reload()
}

