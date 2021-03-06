const axios = require('axios')
const API_KEY = process.env.RAINFOREST_API_KEY

export default async function handler(req, res) {
  const asin = req.query.asin
  const params = {
    api_key: API_KEY,
    type: 'product',
    amazon_domain: 'amazon.com',
    asin: asin
  }
  try {
    const response = await axios.get('https://api.rainforestapi.com/request', { params })
    const product = response.data.product
    res.status(200).json({ product: product })
  } catch (err) {
    console.error(err)
    res.status(200).json({ product: { message: 'Country Not Found' } })
    // res.status(200).json({ product: { asin: 'B00P0YQYYW' } })
    // res.status(500).json({ error: err })
  }
}
