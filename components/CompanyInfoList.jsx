import CompanyInfo from './CompanyInfo.jsx'
import React from 'react'

const CompanyInfoList = (props) => {
  return (
    <div style={{ boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%)' }} className="table-container">
      <table className="table is-bordered is-striped is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            {/* <th>Employee Count</th> */}
            {/* <th>Annual Revenue</th> */}
            {/* <th>Website</th> */}
          </tr>
        </thead>
        <tbody>
          {props.companyDetails.map((value, index) => {
            return <CompanyInfo key={index} companyDetails={value} />
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CompanyInfoList;
