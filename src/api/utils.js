let urlToId = url => {
  let urlParts = url.split('/')
  return Number(urlParts[urlParts.length - 2])
}

export { urlToId }
