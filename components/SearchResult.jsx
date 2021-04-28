import React from 'react'
// import LoadingAnimation from './LoadingAnimation'

const SearchResult = (props) => {
  return (
    <tr>
      <td>{props.result.position}</td>
      <td>{props.result.asin}</td>
      <td>{props.result.brand}</td>
      <td>{props.result.rating}</td>
      <td>{props.result.ratings_total}</td>
      <td>{props.result.monthly_units_sold !== undefined ? props.result.monthly_units_sold : 'N/A'}</td>
      <td>{props.result.monthly_revenue !== undefined ? props.result.monthly_revenue : 'N/A'}</td>
      <td><img className="image is-32x32" src={props.result.image} /></td>
      <td><a href={props.result.link} target="_blank">Link</a></td>
    </tr>
  )
}

export default SearchResult
