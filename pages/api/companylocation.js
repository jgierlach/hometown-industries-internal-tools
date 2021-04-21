const axios = require('axios')
const cheerio = require('cheerio')

const findCountry = (snippet, firstLetter, secondLetter) => {
  console.log('first letter', firstLetter)
  console.log('second letter', secondLetter)
  for (let i = 0; i < snippet.length; i++) {
    console.log(snippet[i])
    if (snippet[i] === firstLetter && snippet[i + 1] === secondLetter) {
      console.log('hello from inside findCountry conditional')
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
      api_key: 'RYKZOV9IZ0E93NSEXKG38Y2O0UGV90OANOX6U35UCWEQWNI50QOCCCFAN6XWPMVIQTHGEP9TCAAHBDRT',
      url: url,
    }
  }).then(function (response) {
    const $ = cheerio.load(response.data)
    const businessInfo = $('.a-unordered-list').text().split(' ')
    const country = assignCountry(businessInfo[businessInfo.length - 1])
    console.log(businessInfo)
    res.status(200).json({ country: country })
  })
}
