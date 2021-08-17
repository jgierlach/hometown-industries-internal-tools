import React, { useState } from 'react';
import Link from 'next/link';
import axios from 'axios'
// import Papa from 'papaparse'
import LoadingAnimation from '../components/LoadingAnimation'
import CompanyInfoList from '../components/CompanyInfoList'
import { CSVLink, CSVDownload } from 'react-csv'
import { useAuth } from '../auth'

export default function RevenueByAsins({ props }) {
  const { user } = useAuth();
  const [textarea, setTextarea] = useState('')
  const [domains, setDomains] = useState([]);
  const [companyInfoArray, setCompanyInfoArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false)

  const clearbit = async () => {
    setIsLoading(true)
    setCompanyInfoArray([])
    for (let i = 0; i < domains.length; i++) {
      const response = await axios.get('/api/clearbit', { params: { domain: domains[i] } })
      console.log(response.data.companyInfo)
      setCompanyInfoArray((companyInfoArray) => [...companyInfoArray, response.data.companyInfo])
    }
    setIsLoading(false)
  }

  if (user) {
    return (
      <div style={{ marginTop: '2rem' }} className="container">
        <div className="is-justify-content-center is-align-items-center is-flex mb-3">
          <div style={{ width: '330px' }} className="box bg-white pa-1 mb-3 mt-2">
            <h1 className="title has-text-centered">Clearbit</h1>
            <div className="mt-2 is-justify-content-center is-align-items-center is-flex">
              <div style={{ width: '14rem' }}>
                <textarea
                  style={{ background: '#fafafa' }}
                  className="textarea is-primary"
                  type="text"
                  value={textarea}
                  placeholder="Paste in your domain(s)"
                  onChange={(event) => {
                    setTextarea(event.target.value)
                    setDomains(event.target.value.split('\n'))
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem' }} className="is-justify-content-center	is-align-items-center is-flex">
              <button
                type="button"
                className="button is-info mr-2"
                onClick={clearbit}>
                Scrape
              </button>
              <CSVLink className="button is-primary" data={companyInfoArray} filename={`clearbit-export-${new Date().toLocaleDateString('en-US')}.csv`}>Export Contacts to CSV</CSVLink>
            </div>

          </div>
        </div>

        {isLoading && <LoadingAnimation />}

        <div style={{ marginTop: '2rem', marginBottom: '2rem' }} className="is-justify-content-center	is-align-items-center is-flex">
          <CompanyInfoList companyDetails={companyInfoArray} />
        </div>
      </div>
    )
  } else {
    return (
      <h1 className="has-text-centered title mt-4">Please <Link href="/login">Login</Link> to your account.</h1>
    )
  }
}
