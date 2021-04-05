const Asin = (props) => {
  return (
    <tr>
      <td>{props.productDetails['ASIN']}</td>
      <td>{props.productDetails['Parent Category']}</td>
      <td>{props.productDetails['Parent Rank']}</td>
      <td>{props.productDetails['Lower Units Sold']}</td>
      <td>{props.productDetails['Expected Units Sold']}</td>
      <td>{props.productDetails['Upper Units Sold']}</td>
      <td>{props.productDetails['Review Score']}</td>
      <td>{props.productDetails['Review Count']}</td>
      <td><img className="image is-32x32" src={props.productDetails.Thumbnail} /></td>
      <td><a href={props.productDetails.Link} target="_blank">Link</a></td>
    </tr>
  )
}

export default Asin