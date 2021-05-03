const axios = require('axios')
const API_KEY = process.env.RAINFOREST_API_KEY

export default function handler(req, res) {
  console.log('find all asins by seller api route fired')
  const sellerId = req.query.sellerId
  const page = req.query.page
  console.log('sellerId', sellerId)
  const params = {
    api_key: API_KEY,
    type: 'seller_products',
    amazon_domain: 'amazon.com',
    seller_id: sellerId,
    page: page
  }
  console.log('params', params)
  // make the http GET request to Rainforest API
  axios.get('https://api.rainforestapi.com/request', { params })
    .then(response => {

      // print the JSON response from Rainforest API
      console.log(JSON.stringify(response.data, 0, 2));
      res.status(200).json({ asins: response.data })
    }).catch(error => {
      // catch and print the error
      console.log(error);
    })
}
