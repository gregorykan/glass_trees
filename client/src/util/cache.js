export const setObject = (obj) => {
  Object.keys(obj).map(key => {
    window.localStorage.setItem(key, obj[key])
  })
}

export const getObject = (keys) => {
  return keys.reduce(reducer, {})
}

export const removeObject = (keys) => {
  return keys.forEach(key => {
    window.localStorage.removeItem(key)
  })
}

const reducer = (sofar, key) => {
  return {
    ...sofar,
    [key]: window.localStorage.getItem(key)
  }
}
