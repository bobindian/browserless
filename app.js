const createBrowser = require('browserless')
const termImg = require('term-img')

// First, create a browserless factory
// that it will keep a singleton process running
const browser = createBrowser()

// After that, you can create as many browser context
// as you need. The browser contexts won't share cookies/cache
// with other browser contexts.
const browserless = browser.createContext()

// Perform the action you want, e.g., getting the HTML markup
const buffer = browserless.screenshot('http://15.207.254.126/mtest/', {
  device: 'iPhone 6'
})

console.log(termImg(buffer))

// After your task is done, destroy your browser context
 browserless.destroyContext()

// At the end, gracefully shutdown the browser process
 browser.close()
