const axios = require('axios')
const cheerio = require('cheerio')
const SCRAPING_BEE_API_KEY = process.env.SCRAPING_BEE_API_KEY
const RAINFOREST_API_KEY = process.env.RAINFOREST_API_KEY
const OPEN_CORPORATES_API_KEY = process.env.OPEN_CORPORATES_API_KEY
import { findSellerPage } from '../../utils/helper'

export default async function handler(req, res) {
  const asin = req.query.asin

  // const params = {
  //   api_key: RAINFOREST_API_KEY,
  //   type: 'product',
  //   amazon_domain: 'amazon.com',
  //   asin: asin
  // }

  const response = await axios.get('https://api.rainforestapi.com/request', {
    params: {
      api_key: RAINFOREST_API_KEY,
      type: 'product',
      amazon_domain: 'amazon.com',
      asin: asin
    }
  })
  const product = response.data.product
  const sellerPage = findSellerPage(product)

  // axios.get('https://app.scrapingbee.com/api/v1', {
  //   params: {
  //     api_key: SCRAPING_BEE_API_KEY,
  //     url: sellerPage,
  //   }
  // }).then(function (r) {
  //   const $ = cheerio.load(r.data)
  //   const businessInfo = $('.a-unordered-list').text().split(':')
  //   // const businessInfo = $('.a-nostyle').text()
  //   console.log(businessInfo)
  //   const businessName = businessInfo[1].split('Business Address')[0]
  //   const businessAddress = businessInfo

  // }).catch(err => {
  //   throw (err)
  // })

  const sellerData = await axios.get('https://app.scrapingbee.com/api/v1', {
    params: {
      api_key: SCRAPING_BEE_API_KEY,
      url: sellerPage,
    }
  })

  const $ = cheerio.load(sellerData.data)
  const businessInfo = $('.a-unordered-list').text().split(':')
  const businessName = businessInfo[1].split('Business Address')[0]
  const businessAddress = businessInfo

  // const openCorporates = await axios.get('https://api.opencorporates.com/v0.4/companies/search', {
  //   params: {
  //     api_token: OPEN_CORPORATES_API_KEY,
  //     q: businessName
  //   }
  // }).then(function (r) {
  //   console.log(r.data.results.companies[0].company.source)
  // }).catch(err => {
  //   throw (err)
  // })

  const openCorporates = await axios.get('https://api.opencorporates.com/v0.4/companies/search', {
    params: {
      api_token: OPEN_CORPORATES_API_KEY,
      q: businessName
    }
  })

  console.log(openCorporates.data.results.companies[0])

  const company_number = openCorporates.data.results.companies[0].company.company_number
  const jurisdiction_code = openCorporates.data.results.companies[0].company.jurisdiction_code

  console.log('company_number', company_number)
  console.log('jurisdiction_code', jurisdiction_code)

  const businessData = await axios.get(`https://api.opencorporates.com/v0.4/companies/${jurisdiction_code}/${company_number}`, {
    params: {
      api_token: OPEN_CORPORATES_API_KEY,
    }
  })

  console.log(businessData.data.results.company.agent_name)
  const businessOwner = businessData.data.results.company.agent_name

  res.status(200).json({ businessName: businessName, businessAddress: businessAddress, businessOwner: businessOwner })
}
