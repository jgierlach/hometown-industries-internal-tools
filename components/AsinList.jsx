import Asin from './Asin.jsx'

const AsinList = (props) => {
  return (
    <div style={{ boxShadow: '0 0.5em 1em -0.125em rgb(10 10 10 / 10%), 0 0 0 1px rgb(10 10 10 / 2%)' }} className="table-container">
      <table className="table is-bordered is-striped is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>ASIN</th>
            <th>Parent Category</th>
            <th>Parent Rank</th>
            <th>Lower Units Sold</th>
            <th>Expected Units Sold</th>
            <th>Upper Units Sold</th>
            <th>Rating</th>
            <th>Review Count</th>
            <th>Thumbnail</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {props.productDetails.map((value, index) => {
            return <Asin key={index} productDetails={value} />
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AsinList;