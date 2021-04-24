const axios = require('axios')
const cheerio = require('cheerio')
const API_KEY = process.env.SCRAPING_BEE_API_KEY

const findCountry = (snippet, firstLetter, secondLetter) => {
  for (let i = 0; i < snippet.length; i++) {
    if (snippet[i] === firstLetter && snippet[i + 1] === secondLetter) {
      return true
    }
  }
  return false
}

const assignCountry = (snippet) => {
  if (findCountry(snippet, 'U', 'S')) {
    return 'US'
  }
  if (findCountry(snippet, 'C', 'N')) {
    return 'CN'
  }
  return 'Country Not Found'
}

export default function handler(req, res) {
  const url = req.query.url
  if (url === 'Sold By Amazon') {
    res.status(200).json({ country: 'This item is sold by Amazon' })
  }
  axios.get('https://app.scrapingbee.com/api/v1', {
    params: {
      api_key: API_KEY,
      url: url,
    }
  }).then(function (response) {
    const $ = cheerio.load(response.data)
    const businessInfo = $('.a-unordered-list').text().split(' ')
    const country = assignCountry(businessInfo[businessInfo.length - 1])
    res.status(200).json({ country: country })
  })
}
