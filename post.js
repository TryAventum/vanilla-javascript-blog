async function setUpCommentFormSubmission(postId) {
  async function publishComment(data = {}) {
    const response = await fetch('http://localhost:3030/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('x-access-token'),
      },
      body: JSON.stringify(data),
    })

    return response.json()
  }

  const form = document.querySelector('form')
  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const subject = event.currentTarget.querySelector('#subject').value
    const body = event.currentTarget.querySelector('#body').value

    const data = {
      subject,
      body,
      post: postId,
    }

    const comment = await publishComment(data)

    location.reload()
  })
}

async function renderCommentsList(comments) {
  const listWrapper = document.createElement('div')
  listWrapper.setAttribute('id', 'comments-list')
  if (comments.length) {
    const commentListHeader = document.createElement('h2')
    commentListHeader.innerHTML = 'Comments:'
    listWrapper.appendChild(commentListHeader)
  }

  for (const comment of comments) {
    const commentWrapper = document.createElement('div')

    const subject = document.createElement('h3')
    subject.innerHTML = comment.subject
    commentWrapper.appendChild(subject)

    const body = document.createElement('p')
    body.innerHTML = comment.body
    commentWrapper.appendChild(body)

    listWrapper.appendChild(commentWrapper)
  }
  document.body.appendChild(listWrapper)
}

async function renderComments(postId) {
  //Fetch post's comments
  async function getPostComments(_postId) {
    let query = { where: { post: _postId } }

    const response = await fetch(
      `http://localhost:3030/comments?query=${encodeURIComponent(
        JSON.stringify(query)
      )}&page=1`
    )
    return response.json() // parses JSON response into native JavaScript objects
  }

  const comments = await getPostComments(postId)

  setUpCommentFormSubmission(postId)

  await renderCommentsList(comments.contents)
}

;(async function () {
  //Get the current page number from the url
  const urlParams = new URLSearchParams(window.location.search)
  const currentPostId = urlParams.get('id')

  //Fetch the post
  async function getPost(id) {
    const response = await fetch(`http://localhost:3030/posts/${id}`)
    return response.json() // parses JSON response into native JavaScript objects
  }

  async function getUpload(id) {
    const response = await fetch(`http://localhost:3030/uploads/${id}`)
    return response.json() // parses JSON response into native JavaScript objects
  }

  const post = await getPost(currentPostId)
  const postFeaturedImage = await getUpload(post.content.featuredImage)

  const postWrapper = document.createElement('div')
  postWrapper.setAttribute('id', 'post-wrapper')

  const featuredImage = document.createElement('img')
  featuredImage.src = postFeaturedImage.path
  featuredImage.alt = postFeaturedImage.originalName
  postWrapper.appendChild(featuredImage)

  const title = document.createElement('h2')
  title.innerHTML = post.content.title
  postWrapper.appendChild(title)

  const body = document.createElement('p')
  body.innerHTML = post.content.body
  postWrapper.appendChild(body)

  document.body.insertBefore(postWrapper, document.querySelector('form'))

  renderComments(currentPostId)

  const currentUser = await getCurrentUser()

  if (currentUser) {
    document.querySelector('form').style.display = 'flex'
  }
})()
