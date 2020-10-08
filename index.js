;(async function () {
  //Get the current page number from the url
  const urlParams = new URLSearchParams(window.location.search)
  const currentPage = Number(urlParams.get('page')) || 1

  //Fetch the posts
  async function getPosts() {
    const response = await fetch(
      `http://localhost:3030/posts?page=${currentPage}`
    )
    return response.json() // parses JSON response into native JavaScript objects
  }

  //Fetch the features images
  async function getUploadsInIds(ids) {
    let query = { whereIn: { column: 'id', values: ids } }

    const response = await fetch(
      `http://localhost:3030/uploads/all?query=${encodeURIComponent(
        JSON.stringify(query)
      )}`
    )
    return response.json() // parses JSON response into native JavaScript objects
  }

  const posts = await getPosts()

  const allFeaturedImagesIds = posts.contents.map((p) => p.featuredImage)

  const uploads = await getUploadsInIds(allFeaturedImagesIds)
  const featuredImages = uploads.uploads

  //render the posts list
  var ul = document.createElement('ul')
  ul.setAttribute('id', 'post-list')

  for (const post of posts.contents) {
    const postFeaturedImage = featuredImages.find(
      (f) => f.id === post.featuredImage
    )
    const link = document.createElement('a')
    link.href = `${window.location.pathname.replace(
      'index.html',
      'post.html'
    )}?id=${post.id}`
    ul.appendChild(link)

    const li = document.createElement('li')
    link.appendChild(li)
    const title = document.createElement('h2')
    title.innerHTML = post.title
    const createdAt = document.createElement('div')
    createdAt.innerHTML = `Created At: ${post.createdAt}`
    const createdBy = document.createElement('div')
    createdBy.innerHTML = `Created By: ${post.createdBy}`
    const updatedAt = document.createElement('div')
    updatedAt.innerHTML = `Updated At: ${post.updatedAt}`
    const updatedBy = document.createElement('div')
    updatedBy.innerHTML = `Updated By: ${post.updatedBy}`
    const featuredImage = document.createElement('img')
    featuredImage.src = postFeaturedImage.path
    featuredImage.alt = postFeaturedImage.originalName
    li.appendChild(featuredImage)
    li.appendChild(title)
    li.appendChild(createdAt)
    li.appendChild(updatedAt)
    li.appendChild(createdBy)
    li.appendChild(updatedBy)
  }
  document.body.appendChild(ul)

  /**
   * Render the pagination
   */
  //We will only render the pagination if we have more than one page
  if (posts.pagination.totalPages > 1) {
    const paginationWrapper = document.createElement('div')
    paginationWrapper.setAttribute('id', 'pagination-wrapper')
    for (
      let pageNumber = 1;
      pageNumber <= posts.pagination.totalPages;
      pageNumber++
    ) {
      const link = document.createElement('a')

      // Add active class to the current page link
      if (pageNumber === currentPage) {
        link.setAttribute('class', 'active')
      }
      link.href = `${window.location.pathname}?page=${pageNumber}`
      link.innerHTML = pageNumber
      paginationWrapper.appendChild(link)
    }

    document.body.appendChild(paginationWrapper)
  }
})()
