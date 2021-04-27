import React, { useState } from 'react';
import axios from 'axios'
import Papa from 'papaparse'
import LoadingAnimation from '../components/LoadingAnimation'
import AsinList from '../components/AsinList'
import { CSVLink, CSVDownload } from 'react-csv'
import { findParentCategory, findParentRank, findChildCategory, findChildRank, findSellerPage } from '../utils/helper'
import { calculateLower, calculateExpected, calculateUpper } from '../utils/revenueCalculator'

export default function RevenueByAsins({ props }) {
  const [textarea, setTextarea] = useState('')
  const [asins, setAsins] = useState([]);
  const [productInfoArray, setProductInfoArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const uploadCSV = (event) => {
    const csvFile = event.target.files[0]
    Papa.parse(csvFile, {
      complete: (result) => {
        const asinsFromCsv = result.data.map((el) => el.asin)
        setAsins(asinsFromCsv)
      },
      header: true
    });
  }

  const fetchProductDetails = async () => {
    setIsLoading(true)
    setProductInfoArray([])
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

      const productInfo = {
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
      setProductInfoArray((productInfoArray) => [...productInfoArray, productInfo])
    }
    setIsLoading(false)
  }

  return (
    <div style={{ marginTop: '1rem' }} className="container">

      <div className="is-justify-content-center is-align-items-center is-flex">
        <div style={{ width: '330px' }} className="box bg-white pa-1 mb-3 mt-2">
          <h1 className="title has-text-centered">Revenue By Asins</h1>
          <div className="mt-2 is-justify-content-center is-align-items-center is-flex">
            <div style={{ width: '14rem' }}>
              <textarea
                style={{ background: '#fafafa' }}
                className="textarea is-primary"
                type="text"
                value={textarea}
                placeholder="Paste in your asins"
                onChange={(event) => {
                  setTextarea(event.target.value)
                  setAsins(event.target.value.split('\n'))
                }}
              />
            </div>
          </div>

          <div className="mt-3 is-flex is-justify-content-center is-align-items-center">
            <input
              className=""
              type="file"
              name="file"
              placeholder={null}
              onChange={(event) => uploadCSV(event)}
            />
          </div>

          <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex">
            <button type="button" className="button is-info mr-2" onClick={fetchProductDetails}>Scrape</button>
            <CSVLink className="button is-primary" data={productInfoArray} filename="asin-scrape.csv">Export Asins to CSV</CSVLink>
          </div>

        </div>
      </div>

      {isLoading && <LoadingAnimation />}

      <div style={{ marginTop: '2rem' }} className="is-justify-content-center	is-align-items-center is-flex">
        <AsinList productDetails={productInfoArray} />
      </div>
    </div>
  )
}
