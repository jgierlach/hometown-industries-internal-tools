const axios = require('axios')
const cheerio = require('cheerio')

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
    const snippet = businessInfo[businessInfo.length - 1].slice(0, businessInfo.length - 36)
    // const country = snippet[snippet.length - 2] + snippet[snippet.length - 1]
    res.status(200).json({ country: 'poot' })
  })
}
