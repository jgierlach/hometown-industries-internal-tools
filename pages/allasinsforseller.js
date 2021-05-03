import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios'
import LoadingAnimation from '../components/LoadingAnimation'
import SearchResultsList from '../components/SearchResultsList'
import { CSVLink } from 'react-csv'
import { findParentCategory, findParentRank, findChildCategory, findChildRank, findSellerPage, findCompanyCountry } from '../utils/helper'
import { calculateLower, calculateExpected, calculateUpper } from '../utils/revenueCalculator'
import { useAuth } from '../auth'

export default function AllAsinsForSeller({ props }) {
  const { user } = useAuth();
  const [asin, setAsin] = useState('')
  const [sellerId, setSellerId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [allAsins, setAllAsins] = useState([])

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
    const numPagesToScrape = sellerAsins.data.asins.pagination.total_pages
    console.log(numPagesToScrape)
    // If the number of seller pages is greater than 1 keep scraping
    for (let i = 2; i <= numPagesToScrape; i++) {
      console.log(`Page ${i} scraped!`)
      const response = await axios.get('/api/findallasinsbyseller', { params: { sellerId: sellerId, page: i } })
      setAllAsins((allAsins) => allAsins.concat(response.data.asins.seller_products))
    }
    setIsLoading(false)
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
              <button onClick={fetchAllAsinsForSeller} type="button" className="button is-primary">Fetch All Asins From Seller</button>
            </div>

            {/* <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex">
              <CSVLink className="button is-primary" data={allAsins} filename="asins.csv">Export Asins to CSV</CSVLink>
            </div> */}

          </div>
        </div>

        {isLoading && <LoadingAnimation />}

        {/* <div style={{ marginTop: '2rem' }} className="is-justify-content-center	is-align-items-center is-flex">
          <AsinList productDetails={allAsins} />
        </div> */}

        <div style={{ marginTop: '2rem' }} className="is-justify-content-center is-align-items-center is-flex">
          <SearchResultsList searchResults={allAsins} />
        </div>
      </div>
    )
  } else {
    return (
      <h1 className="has-text-centered title mt-4">Please <Link href="/login">Login</Link> to your account.</h1>
    )
  }
}
