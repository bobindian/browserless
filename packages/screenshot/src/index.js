'use strict'

const svgGradient = require('svg-gradient')
const isHttpUrl = require('is-url-http')
const sharp = require('sharp')
const path = require('path')
const got = require('got')

const createPreparePage = require('./prepare')

const browserOverlay = {
  dark: path.resolve(__dirname, 'browser/dark.png'),
  light: path.resolve(__dirname, 'browser/light.png')
}

const getBackground = async (bg = 'transparent') => {
  if (isHttpUrl(bg)) {
    const { body } = await got(bg, { encoding: null })
    return body
  }

  if (!bg.includes('gradient')) {
    bg = `linear-gradient(45deg, ${bg} 0%, ${bg} 100%)`
  }

  return Buffer.from(createSvgBackground(bg))
}

const createSvgBackground = css => svgGradient(css, { width: '1388px', height: '955px' })

module.exports = gotoOpts => {
  const preparePage = createPreparePage(gotoOpts)

  return page => async (url, { type = 'png', omitBackground, overlay = {}, ...opts } = {}) => {
    const screenshotOptions = {
      ...opts,
      ...(await preparePage(page, url, { overlay, ...opts })),
      type,
      omitBackground: omitBackground !== undefined ? omitBackground : type === 'png'
    }

    const screenshot = await page.screenshot(screenshotOptions)

    if (Object.keys(overlay).length === 0) return screenshot

    const { browser: browserSkin, background } = overlay
    let image = await sharp(await getBackground(background))
    let inputs = [{ input: screenshot }]

    if (browserSkin) {
      const input = browserOverlay[browserSkin]
      if (input) inputs = [{ input }].concat(inputs)
    }

    image = await image.composite(inputs)
    return opts.path ? image.toFile(opts.path) : image.toBuffer()
  }
}
