const CLEARBIT_KEY = process.env.CLEARBIT_KEY
const clearbit = require('clearbit')(CLEARBIT_KEY)

const setPhoneNumber = (companyNumber, siteNumbers) => {
  if (companyNumber === null) {
    if (siteNumbers === null) {
      return 'N/A'
    } else {
      return siteNumbers[0]
    }
  }
  return companyNumber
}

const setEmail = (siteEmails) => {
  if (siteEmails === null) {
    return 'N/A'
  }
  return siteEmails[0]
}

const checkUrl = (url, handle) => {
  if (handle === null) {
    return 'N/A'
  }
  return `${url}/${handle}`
}

const checkNull = (val) => {
  if (val === null) {
    return 'N/A'
  }
  return val
}

export default async function handler(req, res) {
  const domain = req.query.domain
  // setTimeout(async function () {
  console.log(`processing ${domain}`)
  var Company = clearbit.Company
  try {
    const company = await Company.find({ domain: domain })
    console.log('company', company)

    let phoneNumber = setPhoneNumber(company.phone, company.site.phoneNumbers)

    let emailAddress = setEmail(company.site.emailAddresses)

    const companyInfo = {
      'Company Website': domain,
      'First Name': '',
      'Last Name': '',
      'Phone Number': phoneNumber,
      'Email Address': emailAddress,
      'Company Name': company.name,
      'Company Facebook': checkUrl('https://www.facebook.com', company.facebook.handle),
      'Company LinkedIn': checkUrl('https://www.linkedin.com', company.linkedin.handle),
      'Company Twitter': checkUrl('https://www.twitter.com', company.twitter.handle),
      'Number Of Employees': checkNull(company.metrics.employees),
      'Annual Revenue': checkNull(company.metrics.annualRevenue),
    }
    // console.log(item)
    res.json({ companyInfo })
  } catch (err) {
    console.log(err)
  }
  // }, 1000);
}
