import React, { useState } from 'react';
import axios from 'axios'
import SearchResultsList from '../components/SearchResultsList'
import LoadingAnimation from '../components/LoadingAnimation'
import { CSVLink } from 'react-csv';
import { useAuth } from '../auth'
import Link from 'next/link'

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

  const fetchSerp = async () => {
    setSearchResults([])
    setSearchPayload([])
    setFilterOption('')
    setIsLoading(true)

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
              <CSVLink className="button is-primary" data={searchResults} filename="search-results.csv">Export Asins to CSV</CSVLink>
            </div>

          </div>
        </div>

        {isLoading && <LoadingAnimation />}

        <div style={{ marginTop: '2rem' }} className="is-justify-content-center is-align-items-center is-flex">
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
