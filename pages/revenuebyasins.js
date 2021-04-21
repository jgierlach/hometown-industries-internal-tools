import React from 'react'
import axios from 'axios'
import Papa from 'papaparse'
import LoadingAnimation from '../components/LoadingAnimation'
import AsinList from '../components/AsinList'
import { CSVLink, CSVDownload } from 'react-csv'
import { findParentCategory, findParentRank, findChildCategory, findChildRank, findSellerPage } from '../utils/helper'
import { calculateLower, calculateExpected, calculateUpper } from '../utils/revenueCalculator'

class RevenueByAsins extends React.Component {
  constructor() {
    super();
    this.state = { asins: [], productDetails: [], isLoading: false };
    this.handleChange = this.handleChange.bind(this);
    this.fetchProductDetails = this.fetchProductDetails.bind(this);
    this.uploadCSV = this.uploadCSV.bind(this);
  }

  handleChange(event) {
    const asins = event.target.value.split('\n')
    this.setState({ asins: asins });
  }

  uploadCSV = (event) => {
    const csvFile = event.target.files[0]
    Papa.parse(csvFile, {
      complete: (result) => {
        const asins = result.data.map((el) => el.asin)
        this.setState({ asins: asins })
      },
      header: true
    });
  };

  async fetchProductDetails() {
    this.setState({ isLoading: true, productDetails: [] })
    const asins = this.state.asins
    for (let i = 0; i < asins.length; i++) {
      // Scrape product detail page
      const response = await axios.get('/api/scrapeamazonlisting', { params: { asin: asins[i] } })
      const product = response.data.product

      // Find thumbnail, review count, and review score
      const thumbnail = product.main_image.link
      const reviewCount = product.ratings_total
      const reviewScore = product.rating

      // Find rank object
      const bestSellersRank = product.bestsellers_rank

      // Find parent category and rank
      const parentCategory = findParentCategory(bestSellersRank)
      const parentRank = findParentRank(bestSellersRank)

      // Find child category and rank
      const childCategory = findChildCategory(bestSellersRank)
      const childRank = findChildRank(bestSellersRank)

      // Find company location
      const sellerPage = findSellerPage(product)
      const location = await axios.get('/api/companylocation', { params: { url: sellerPage } })
      const companyCountry = location.data.country

      const productDetails = {
        ASIN: asins[i],
        'Lower Units Sold': calculateLower(parentRank, reviewCount, parentCategory),
        'Expected Units Sold': calculateExpected(parentRank, reviewCount, parentCategory),
        'Upper Units Sold': calculateUpper(parentRank, reviewCount, parentCategory),
        'Review Count': reviewCount,
        'Review Score': reviewScore,
        'Parent Category': parentCategory,
        'Parent Rank': parentRank,
        'Child Category': childCategory,
        'Child Rank': childRank,
        'Company Country': companyCountry,
        Thumbnail: thumbnail,
        Link: `https://www.amazon.com/dp/${asins[i]}`
      }
      this.setState({ productDetails: [...this.state.productDetails, productDetails] })
    }
    this.setState({ isLoading: false })
  }

  render() {
    return (
      <div style={{ marginTop: '1rem' }}>
        <h1 className="title has-text-centered">Revenue By Asins</h1>
        <div className="mt-2 is-justify-content-center is-align-items-center is-flex">
          <div style={{ width: '14rem' }}>
            <textarea className="textarea is-primary" type="text" value={this.state.asin} onChange={this.handleChange} placeholder="Paste in your asins" />
          </div>
        </div>

        <div className="mt-3 is-flex is-justify-content-center is-align-items-center">
          <input
            className=""
            type="file"
            name="file"
            placeholder={null}
            onChange={this.uploadCSV}
          />
        </div>

        <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex">
          <button type="button" className="button is-info mr-2" onClick={this.fetchProductDetails}>Scrape</button>
          <CSVLink className="button is-primary" data={this.state.productDetails} filename="asin-scrape.csv">Export Asins to CSV</CSVLink>
        </div>

        {this.state.isLoading && <LoadingAnimation />}

        <div style={{ marginTop: '2rem' }} className="is-justify-content-center	is-align-items-center is-flex">
          <AsinList productDetails={this.state.productDetails} />
        </div>
      </div>
    )
  }
}

export default RevenueByAsins
