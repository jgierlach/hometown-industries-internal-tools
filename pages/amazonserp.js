import React from 'react'
import axios from 'axios'
import SearchResultsList from '../components/SearchResultsList'
import LoadingAnimation from '../components/LoadingAnimation'
import { CSVLink } from 'react-csv';
// import { useAuth } from '../auth'

class AmazonSerp extends React.Component {
  constructor() {
    super();
    this.state = { searchInput: '', searchResults: [], searchPayload: [], isLoading: false, numPagesToScrape: 1, filterOption: '', brandName: '' };

    this.handleChange = this.handleChange.bind(this);
    this.fetchSerp = this.fetchSerp.bind(this);
    this.updatePageCount = this.updatePageCount.bind(this)
    this.updateFilterOption = this.updateFilterOption.bind(this)
    this.updateBrandName = this.updateBrandName.bind(this)
  }

  handleChange(event) {
    this.setState({ searchInput: event.target.value });
  }

  updatePageCount(event) {
    this.setState({ numPagesToScrape: Number(event.target.value) })
  }

  updateFilterOption(event) {
    this.setState({ filterOption: event.target.value })
    const asins = this.state.searchResults
    let searchResults = []
    if (event.target.value === 'Default') {
      searchResults = this.state.searchPayload
      this.setState({ searchResults: searchResults })
    }
    if (event.target.value === 'Most Reviews') {
      for (let i = 0; i < asins.length; i++) {
        if (asins[i].ratings_total === undefined) {
          asins[i].ratings_total = 0
          searchResults.push(asins[i])
        } else {
          searchResults.push(asins[i])
        }
      }
      const sortByHighestReviews = searchResults.sort((a, b) => b.ratings_total - a.ratings_total)
      this.setState({ searchResults: sortByHighestReviews })
    }
  }

  updateBrandName(event) {
    this.setState({ brandName: event.target.value })
    let filteredByBrandName = []
    if (event.target.value == '') {
      filteredByBrandName = this.state.searchPayload
      this.setState({ searchResults: filteredByBrandName })
    } else {
      filteredByBrandName = this.state.searchResults.filter(asin => asin.brand.toLowerCase().includes(event.target.value.toLowerCase()))
      this.setState({ searchResults: filteredByBrandName })
    }
  }

  async fetchSerp() {
    this.setState({ searchResults: [], searchPayload: [], filterOption: '', isLoading: true })
    const numPagesToScrape = this.state.numPagesToScrape
    for (let i = 0; i < numPagesToScrape; i++) {
      let pageNumber = i + 1
      console.log('pageNumber', pageNumber)
      this.setState({ isLoading: true })
      const searchInput = this.state.searchInput
      const response = await axios.get('/api/scrapeamazonsearch', { params: { pageNumber: numPagesToScrape[i], searchInput: searchInput } })
      const searchResults = response.data.searchResults
      this.setState({ searchResults: this.state.searchResults.concat(searchResults), searchPayload: this.state.searchResults.concat(searchResults), isLoading: false })
    }
    this.setState({ isLoading: false })
  }

  render() {
    return (
      <div style={{ marginTop: '1rem' }}>
        <h1 className="title has-text-centered">Amazon SERP</h1>

        <div className="mt-2 is-justify-content-center	is-align-items-center is-flex">
          <p className="title is-5">Go back <input style={{ width: '30px' }} onChange={this.updatePageCount} type="text" value={this.state.numPagesToScrape} /> page{this.state.numPagesToScrape > 1 && <span>s</span>}</p>
        </div>

        <div className="mt-3 is-justify-content-center is-align-items-center is-flex">
          <div className="field has-addons">
            <div className="control">
              <input className="input" type="text" value={this.state.searchInput} onChange={this.handleChange} placeholder="search Amazon" />
            </div>
            <div className="control">
              <button type="button" className="button is-info" onClick={this.fetchSerp}>
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="mt-3 is-justify-content-center is-align-items-center is-flex">
          <p>Filter By: <span><input placeholder="Brand Name" onChange={this.updateBrandName} type="text" value={this.state.brandName} /></span></p>
        </div>

        <div className="mt-2 is-justify-content-center is-align-items-center is-flex">
          <p>Sort By:
          <select value={this.state.filterOption} onChange={this.updateFilterOption}>
              <option value="Default">Default</option>
              <option value="Most Reviews">Most Reviews</option>
            </select>
          </p>
        </div>

        <div className="mt-3 mb-2 is-justify-content-center	is-align-items-center is-flex">
          <CSVLink className="button is-primary" data={this.state.searchResults} filename="search-results.csv">Export Asins to CSV</CSVLink>
        </div>

        {this.state.isLoading && <LoadingAnimation />}

        <div className="mt-3 is-justify-content-center is-align-items-center is-flex">
          <SearchResultsList searchResults={this.state.searchResults} />
        </div>
      </div>
    )
  }
}

export default AmazonSerp
