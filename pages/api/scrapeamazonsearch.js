const axios = require('axios')
const API_KEY = process.env.RAINFOREST_API_KEY

export default async function handler(req, res) {
  const pageNumber = req.query.pageNumber
  const searchInput = req.query.searchInput
  const params = {
    api_key: API_KEY,
    type: 'search',
    page: pageNumber,
    amazon_domain: 'amazon.com',
    search_term: searchInput
  }
  try {
    const response = await axios.get('https://api.rainforestapi.com/request', { params })
    const searchResults = response.data.search_results
    res.status(200).json({ searchResults: searchResults })
  } catch (err) {
    res.status(500).json({ error: err })
    console.error(err)
  }
}
