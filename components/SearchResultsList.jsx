import SearchResult from './SearchResult.jsx'

const SearchResultsList = (props) => {
  return (
    <div style={{ boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%)' }} className="table-container">
      <table className="table is-bordered is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Position</th>
            <th>ASIN</th>
            <th>Brand</th>
            <th>Rating</th>
            <th>Review Count</th>
            <th>Expected Units Sold</th>
            <th>Monthly Revenues</th>
            <th>Thumbnail</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {props.searchResults.map((value, index) => {
            return <SearchResult key={index} result={value} />
          })}
        </tbody>
      </table>
    </div>
  )
}

export default SearchResultsList;
