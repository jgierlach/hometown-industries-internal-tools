import React from 'react'
import { calculateLowerLifetimeUnitsSold, calculateUpperLifetimeUnitsSold } from '../utils/revenueCalculator'
// import LoadingAnimation from './LoadingAnimation'
const findPrice = (price) => {
  if (price === undefined) {
    return 0
  }
  return price.value
}

const AsinsBySeller = (props) => {
  const number = Intl.NumberFormat();
  const { asin, brand, rating, ratings_total, image, link } = props.result
  const price = findPrice(props.result.price)
  const symbol = '$'
  const lowerLifetimeUnitsSold = number.format(Math.floor(calculateLowerLifetimeUnitsSold(ratings_total)))
  const lowerLifetimeRevenue = `${symbol}${number.format(Math.floor(calculateLowerLifetimeUnitsSold(ratings_total) * price))}`
  return (
    <tr>
      <td>{symbol}{price}</td>
      <td>{asin}</td>
      <td>{brand}</td>
      <td>{rating}</td>
      <td>{ratings_total}</td>
      {/* <td>{props.result.monthly_units_sold !== undefined ? props.result.monthly_units_sold : 'N/A'}</td> */}
      {/* <td>{props.result.monthly_revenue !== undefined ? props.result.monthly_revenue : 'N/A'}</td> */}
      <td>{lowerLifetimeUnitsSold}</td>
      <td>{lowerLifetimeRevenue}</td>
      <td><img className="image is-32x32" src={image} /></td>
      <td><a href={link} target="_blank">Link</a></td>
    </tr>
  )
}

export default AsinsBySeller
