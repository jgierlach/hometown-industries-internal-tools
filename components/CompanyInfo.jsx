const CompanyInfo = (props) => {
  return (
    <tr>
      <td>{props.companyDetails['Company Name']}</td>
      <td>{props.companyDetails['Email Address']}</td>
      <td>{props.companyDetails['Phone Number']}</td>
      {/* <td>{props.companyDetails['Number Of Employees']}</td> */}
      {/* <td>{props.companyDetails['Annual Revenue']}</td> */}
      {/* <td><a href={props.productDetails['Company Website']} target="_blank">Link</a></td> */}
    </tr>
  )
}

export default CompanyInfo
