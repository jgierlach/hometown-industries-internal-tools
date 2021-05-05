import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios'
import LoadingAnimation from '../components/LoadingAnimation'
import AsinsBySellerList from '../components/AsinsBySellerList'
import { CSVLink } from 'react-csv'
import { findParentCategory, findParentRank, findChildCategory, findChildRank, findSellerPage, findCompanyCountry } from '../utils/helper'
import { calculateLowerLifetimeUnitsSold } from '../utils/revenueCalculator'
import { useAuth } from '../auth'

export default function AllAsinsForSeller({ props }) {
  const { user } = useAuth();
  const [asin, setAsin] = useState('')
  const [sellerId, setSellerId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [allAsins, setAllAsins] = useState([])
  const [showStats, setShowStats] = useState(false)

  const number = Intl.NumberFormat();

  const fetchSellerId = async () => {
    setIsLoading(true)
    const response = await axios.get('/api/scrapeamazonlisting', { params: { asin: asin } })
    const product = response.data.product
    const sellerPage = findSellerPage(product)
    setSellerId(sellerPage.split('seller=')[1].split('&')[0])
    setIsLoading(false)
  }

  const fetchAllAsinsForSeller = async () => {
    setAllAsins([])
    setIsLoading(true)
    // Make initial request to fetch seller's first page and the total number of pages
    const sellerAsins = await axios.get('/api/findallasinsbyseller', { params: { sellerId: sellerId, page: 1 } })
    // Set asins based on what you find on the first page
    setAllAsins(sellerAsins.data.asins.seller_products)
    // Set the total number of pages to scrape based on what you see in the first call
    let numPagesToScrape = 1
    if (sellerAsins.data.asins.pagination !== undefined) {
      numPagesToScrape = sellerAsins.data.asins.pagination.total_pages
    }
    console.log(numPagesToScrape)
    // If the number of seller pages is greater than 1 keep scraping
    if (numPagesToScrape > 1) {
      for (let i = 2; i <= numPagesToScrape; i++) {
        console.log(`Page ${i} scraped!`)
        const response = await axios.get('/api/findallasinsbyseller', { params: { sellerId: sellerId, page: i } })
        setAllAsins((allAsins) => allAsins.concat(response.data.asins.seller_products))
      }
    }
    setIsLoading(false)
    setShowStats(true)
  }

  const calculateTotalLifetimeSalesVolume = (allAsins) => {
    let lifetimeSales = 0
    allAsins.forEach(asins => {
      lifetimeSales += calculateLowerLifetimeUnitsSold(asins.ratings_total)
    })
    return lifetimeSales
  }

  const calculateTotalLifetimeSalesRevenue = (allAsins) => {
    let lifetimeRevenue = 0
    allAsins.forEach(asins => {
      lifetimeRevenue += calculateLowerLifetimeUnitsSold(asins.ratings_total) * asins.price.value
    })
    return lifetimeRevenue
  }

  const calculateMedianReviewCount = (allAsins) => {
    if (allAsins.length === 0) return 0;

    allAsins.sort(function (a, b) {
      return a.ratings_total - b.ratings_total;
    });

    var half = Math.floor(allAsins.length / 2);

    if (allAsins.length % 2) { return allAsins[half].ratings_total; }

    return (allAsins[half - 1].ratings_total + allAsins[half].ratings_total) / 2.0;
  }

  const calculateAverageReviewCount = (allAsins) => {
    let reviewCount = 0
    allAsins.forEach(asins => {
      reviewCount += asins.ratings_total
    })
    return reviewCount / allAsins.length
  }

  const calculateMaxReviewCount = (allAsins) => {
    return Math.max.apply(Math, allAsins.map(asins => asins.ratings_total));
  }

  if (user) {
    return (
      <div style={{ marginTop: '2rem' }} className="container">

        <div className="is-justify-content-center is-align-items-center is-flex">
          <div style={{ width: '330px' }} className="box bg-white pa-1 mb-3 mt-2">
            <h1 className="title has-text-centered">All Asins By Seller</h1>
            <div className="mt-3 is-justify-content-center is-align-items-center is-flex">
              <div className="field has-addons">
                <div className="control">
                  <input
                    style={{ background: '#fafafa' }}
                    className="input"
                    type="text"
                    value={asin}
                    onChange={(event) => setAsin(event.target.value)}
                    placeholder="Enter an asin" />
                </div>
                <div className="control">
                  <button type="button" className="button is-info" onClick={fetchSellerId}>
                    Fetch Seller Id
                  </button>
                </div>
              </div>
            </div>

            {/* {isLoading && <LoadingAnimation />} */}

            <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex box pa-1">
              <p className="title is-6">Seller ID: {sellerId}</p>
            </div>

            <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex">
              <button onClick={fetchAllAsinsForSeller} type="button" className="button is-info">Fetch All Asins From Seller</button>
            </div>

            <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex">
              <CSVLink className="button is-primary" data={allAsins} filename="asins.csv">Export Asins to CSV</CSVLink>
            </div>

          </div>
        </div>

        { showStats &&
          <div className="is-justify-content-center is-align-items-center is-flex mt-3">
            <div style={{ boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%)' }} className="table-container">
              <table className="table is-bordered is-striped is-fullwidth">
                <thead>
                  <tr>
                    <th>Total Sku Count</th>
                    <th>Total Lifetime Sales Volume</th>
                    <th>Total Lifetime Sales Revenue</th>
                    <th>Median Review Count</th>
                    <th>Average Review Count</th>
                    <th>Max Review Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{allAsins.length}</td>
                    <td>{number.format(Math.floor(calculateTotalLifetimeSalesVolume(allAsins)))}</td>
                    <td>${number.format(Math.floor(calculateTotalLifetimeSalesRevenue(allAsins)))}</td>
                    <td>{calculateMedianReviewCount(allAsins)}</td>
                    <td>{number.format(Math.floor(calculateAverageReviewCount(allAsins)))}</td>
                    <td>{number.format(calculateMaxReviewCount(allAsins))}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        }

        {isLoading && <LoadingAnimation />}

        {/* <div style={{ marginTop: '2rem' }} className="is-justify-content-center	is-align-items-center is-flex">
          <AsinList productDetails={allAsins} />
        </div> */}

        <div style={{ marginTop: '2rem', marginBottom: '2rem' }} className="is-justify-content-center is-align-items-center is-flex">
          <AsinsBySellerList searchResults={allAsins} />
        </div>
      </div>
    )
  } else {
    return (
      <h1 className="has-text-centered title mt-4">Please <Link href="/login">Login</Link> to your account.</h1>
    )
  }
}
