import React from 'react'
import AsinBySeller from './AsinsBySeller.jsx'

const AsinsBySellerList = (props) => {
  return (
    <div style={{ boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%)' }} className="table-container">
      <table className="table is-bordered is-striped is-fullwidth">
        <thead>
          <tr>
            {/* <th>Position</th> */}
            <th>Price</th>
            <th>ASIN</th>
            <th>Brand</th>
            <th>Rating</th>
            <th>Review Count</th>
            <th>Lifetime Units Sold</th>
            <th>Lifetime Revenues</th>
            <th>Thumbnail</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {props.searchResults.map((value, index) => {
            return <AsinBySeller key={index} result={value} />
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AsinsBySellerList
