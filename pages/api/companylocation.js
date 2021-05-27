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
  if (findCountry(snippet, 'C', 'A')) {
    return 'CA'
  }
  if (findCountry(snippet, 'M', 'X')) {
    return 'MX'
  }
  if (findCountry(snippet, 'D', 'E')) {
    return 'DE'
  }
  if (findCountry(snippet, 'E', 'S')) {
    return 'ES'
  }
  if (findCountry(snippet, 'F', 'R')) {
    return 'FR'
  }
  if (findCountry(snippet, 'G', 'B')) {
    return 'GB'
  }
  if (findCountry(snippet, 'I', 'T')) {
    return 'IT'
  }
  if (findCountry(snippet, 'I', 'T')) {
    return 'IT'
  }
  if (findCountry(snippet, 'I', 'N')) {
    return 'IN'
  }
  if (findCountry(snippet, 'J', 'P')) {
    return 'JP'
  }
  if (findCountry(snippet, 'H', 'K')) {
    return 'HK'
  }
  if (findCountry(snippet, 'M', 'U')) {
    return 'MU'
  }
  return 'Country Not Found'
}

const findBusinessName = (businessInfo) => {
  console.log(businessInfo.split('Business Name:')[1].split('Business Address:')[0])
  if (businessInfo === undefined || businessInfo.split('Business Name:') === undefined || businessInfo.split('Business Name:')[1] === undefined || businessInfo.split('Business Name:')[1].split('Business Address:') === undefined || businessInfo.split('Business Name:')[1].split('Business Address:')[0] === undefined) {
    return 'Not Found'
  }
  return businessInfo.split('Business Name:')[1].split('Business Address:')[0]
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
      render_js: 'false',
    }
  }).then(function (response) {
    const $ = cheerio.load(response.data)
    const businessInfo = $('.a-unordered-list').text().split(' ')
    const businessNameInfo = $('.a-unordered-list').text()
    const businessName = findBusinessName(businessNameInfo)
    const country = assignCountry(businessInfo[businessInfo.length - 1])
    res.status(200).json({ country: country, company_name: businessName })
  }).catch(err => {
    console.log(err)
    throw err
  })
}
