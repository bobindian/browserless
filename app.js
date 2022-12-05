const createBrowser = require('browserless')
const termImg = require('term-img')

// First, create a browserless factory
// that it will keep a singleton process running
const browser = createBrowser()

// After that, you can create as many browser context
// as you need. The browser contexts won't share cookies/cache
// with other browser contexts.
const browserless = await browser.createContext()

// Perform the action you want, e.g., getting the HTML markup
const buffer = await browserless.screenshot('http://example.com', {
  device: 'iPhone 6'
})

console.log(termImg(buffer))

// After your task is done, destroy your browser context
await browserless.destroyContext()

// At the end, gracefully shutdown the browser process
await browser.close()