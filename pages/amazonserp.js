import React, { useState } from 'react';
import axios from 'axios'
import SearchResultsList from '../components/SearchResultsList'
import LoadingAnimation from '../components/LoadingAnimation'
import { CSVLink } from 'react-csv';
import { useAuth } from '../auth'
import Link from 'next/link'
import { findParentCategory, findParentRank, findSellerPage, findCompanyCountry } from '../utils/helper'
import { calculateLowerLifetimeUnitsSold, calculateUpperLifetimeUnitsSold } from '../utils/revenueCalculator'

export default function AmazonSerp({ props }) {
  const { user } = useAuth();
  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searchPayload, setSearchPayload] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [numPagesToScrape, setNumPagesToScrape] = useState(1)
  const [filterOption, setFilterOption] = useState('')
  const [brandName, setBrandName] = useState('')

  const updateSearchInput = (event) => {
    setSearchInput(event.target.value)
  }

  const updateNumPagesToScrape = (event) => {
    setNumPagesToScrape(Number(event.target.value))
  }

  const updateFilterOption = (event) => {
    if (event.target.value === 'Default') {
      setFilterOption('Default')
      setSearchResults(searchPayload)
    }
    if (event.target.value === 'Most Reviews') {
      setFilterOption('Most Reviews')
      setSearchResults((searchResults) => {
        const filterUndefinedValues = searchResults.filter(result => result.ratings_total !== undefined)
        return filterUndefinedValues.sort((a, b) => b.ratings_total - a.ratings_total)
      })
    }
  }

  const updateBrandName = (event) => {
    setBrandName(event.target.value)
  }

  const scrapeIndividualListings = async () => {
    setIsLoading(true)
    // Scrape individual listings to find Brand name and sales volume
    for (let i = 0; i < searchResults.length; i++) {
      let currentSearchResult = searchResults[i]
      // const response = await axios.get('/api/scrapeamazonlisting', { params: { asin: searchResults[i].asin } })
      // // Individual listing
      // const product = response.data.product

      // // Find rank object
      // const bestSellersRank = product.bestsellers_rank

      // // Find parent category and rank
      // const parentCategory = findParentCategory(bestSellersRank)
      // const parentRank = findParentRank(bestSellersRank)

      // Find the price
      const findPrice = () => {
        if (currentSearchResult.price === undefined) {
          return 0
        }
        return currentSearchResult.price.value
      }

      const price = findPrice()
      const number = new Intl.NumberFormat()

      // Find review count
      const reviewCount = searchResults[i].ratings_total

      // Find lower lifetime sales volume
      const expected = calculateLowerLifetimeUnitsSold(reviewCount)

      const lifetime_sales_volume = number.format(Math.floor(expected))
      const lifetime_revenue = `$${number.format(Math.floor(price * expected))}`

      setSearchResults((searchResults) => searchResults.map(searchResult => (searchResult.asin === currentSearchResult.asin ? { ...searchResult, lifetime_sales_volume, lifetime_revenue } : searchResult)))

      console.log('current search result', currentSearchResult)
    }
    setIsLoading(false)
  }

  const fetchSerp = async () => {
    setSearchResults([])
    setSearchPayload([])
    setFilterOption('')
    setIsLoading(true)

    // Scrape and load asins from Amazon search
    for (let i = 0; i < numPagesToScrape; i++) {
      let pageNumber = i + 1
      console.log('pageNumber', pageNumber)
      const response = await axios.get('/api/scrapeamazonsearch', { params: { pageNumber: pageNumber, searchInput: searchInput } })
      setSearchResults((searchResults) => searchResults.concat(response.data.searchResults))
      setSearchPayload((searchResults) => searchResults.concat(response.data.searchResults))
    }

    setIsLoading(false)
  }

  if (user) {
    return (
      <div style={{ marginTop: '2rem' }}>

        <div className="is-justify-content-center is-align-items-center is-flex">
          <div style={{ width: '330px' }} className="box bg-white pa-1 mb-3 mt-2">

            <h1 className="title has-text-centered">Amazon SERP</h1>

            <div className="mt-3 is-justify-content-center is-align-items-center is-flex">
              <div className="field has-addons">
                <div className="control">
                  <input
                    style={{ background: '#fafafa' }}
                    className="input"
                    type="text"
                    value={searchInput}
                    onChange={(event) => updateSearchInput(event)}
                    placeholder="search Amazon" />
                </div>
                <div className="control">
                  <button type="button" className="button is-info" onClick={fetchSerp}>
                    Search
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 is-justify-content-center is-align-items-center is-flex">
              <p>Go back
              <input
                  style={{ width: '30px' }}
                  onChange={event => updateNumPagesToScrape(event)}
                  type="text"
                  value={numPagesToScrape} />
              page{numPagesToScrape > 1 && <span>s</span>}
              </p>
            </div>

            <div className="mt-3 is-justify-content-center is-align-items-center is-flex">
              <p>Filter By:
              <span>
                  <input
                    placeholder="Brand Name"
                    onChange={(event) => updateBrandName(event)}
                    type="text"
                    value={brandName} />
                </span>
              </p>
            </div>

            <div className="mt-2 is-justify-content-center is-align-items-center is-flex">
              <p>Sort By:
               <select value={filterOption} onChange={(event) => updateFilterOption(event)}>
                  <option value="Default">Default</option>
                  <option value="Most Reviews">Most Reviews</option>
                </select>
              </p>
            </div>

            <div className="mt-3 mb-2 is-justify-content-center	is-align-items-center is-flex">
              {/* <button type="button" className="button is-primary is-small mr-2" onClick={scrapeIndividualListings}>Estimate Revenues</button> */}

              <CSVLink className="button is-primary mt-2" data={searchResults} filename="search-results.csv">Export Asins to CSV</CSVLink>
            </div>

          </div>
        </div>

        {isLoading && <LoadingAnimation />}

        <div style={{ marginTop: '2rem', marginBottom: '2rem' }} className="is-justify-content-center is-align-items-center is-flex">
          <SearchResultsList searchResults={searchResults} />
        </div>
      </div>
    )
  } else {
    return (
      <h1 className="has-text-centered title mt-4">Please <Link href="/login">Login</Link> to your account.</h1>
    )
  }
}
