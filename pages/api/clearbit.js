const CLEARBIT_KEY = process.env.CLEARBIT_KEY
const clearbit = require('clearbit')(CLEARBIT_KEY)

export default async function handler(req, res) {
  const domain = req.query.domain
  // setTimeout(async function () {
  console.log(`processing ${domain}`)
  var Company = clearbit.Company
  try {
    const company = await Company.find({ domain: domain })
    console.log('company', company)
    const companyInfo = {
      'Company Website': domain,
      'First Name': '',
      'Last Name': '',
      'Phone Number': `${company.site.phoneNumbers.toString()}, ${company.phone}`,
      'Email Address': company.site.emailAddresses.toString(),
      'Company Name': company.name,
      'Company Facebook': `https://www.facebook.com/${company.facebook.handle}`,
      'Company LinkedIn': `https://www.linkedin.com/${company.linkedin.handle}`,
      'Company Twitter': `https://www.twitter.com/${company.twitter.handle}`,
      'Number Of Employees': company.metrics.employees,
      'Annual Revenue': company.metrics.annualRevenue,
    }
    // console.log(item)
    res.json({ companyInfo })
  } catch (err) {
    console.log(err)
  }
  // }, 1000);
}
