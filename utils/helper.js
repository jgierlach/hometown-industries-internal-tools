import axios from 'axios'

const findBestSellersRank = (product) => {
  if (product === undefined || product.bestsellers_rank === undefined) {
    return undefined
  }
  return product.bestsellers_rank
}

const findParentCategory = (bestSellersRank) => {
  if (bestSellersRank === undefined || bestSellersRank[0] === undefined || bestSellersRank[0].category === undefined) {
    return 'No Parent Category'
  }
  return bestSellersRank[0].category
}

const findParentRank = (bestSellersRank) => {
  if (bestSellersRank === undefined || bestSellersRank[0] === undefined || bestSellersRank[0].rank === undefined) {
    return 'No Parent Rank'
  }
  return bestSellersRank[0].rank
}

const findChildCategory = (bestSellersRank) => {
  if (bestSellersRank !== undefined && bestSellersRank.length === 2) {
    if (bestSellersRank[1] === undefined || bestSellersRank[1].category === undefined) {
      return 'No Child category'
    }
    return bestSellersRank[1].category
  }
  return 'No Child Category'
}

const findChildRank = (bestSellersRank) => {
  if (bestSellersRank !== undefined && bestSellersRank.length === 2) {
    if (bestSellersRank[1] === undefined || bestSellersRank[1].rank === undefined) {
      return 'No Child Rank'
    }
    return bestSellersRank[1].rank
  }
  return 'No Child Rank'
}

const findSellerPage = (product) => {
  if (product === undefined || product.buybox_winner === undefined || product.buybox_winner.fulfillment === undefined || product.buybox_winner.fulfillment.third_party_seller === undefined || product.buybox_winner.fulfillment.third_party_seller.link === undefined) {
    return 'Sold By Amazon'
  }
  return product.buybox_winner.fulfillment.third_party_seller.link
}

const findCompanyCountry = async (sellerPage, scrapeForSellerCountry) => {
  if (sellerPage === 'Sold By Amazon') {
    return 'Sold By Amazon'
  }
  if (scrapeForSellerCountry) {
    try {
      const location = await axios.get('/api/companylocation', { params: { url: sellerPage } })
      return location.data
    } catch (err) {
      console.error(err)
    }
  }
  return 'N/A'
}

const findThumbnail = (product) => {
  if (product === undefined || product.main_image === undefined) {
    return 'https://i.stack.imgur.com/mwFzF.png'
  }
  return product.main_image.link
}

const findReviewCount = (product) => {
  if (product === undefined || product.ratings_total === undefined) {
    return 0
  }
  return product.ratings_total
}

const findReviewScore = (product) => {
  if (product === undefined || product.rating === undefined) {
    return 'Not rated'
  }
  return product.rating
}

const findBrand = (product) => {
  if (product === undefined || product.brand === undefined) {
    return 'Brand not found'
  }
  return product.brand
}

const findNumberOfOtherSellers = (product) => {
  if (product === undefined || product.more_buying_choices === undefined) {
    return 0
  }
  return product.more_buying_choices.length
}

const findPrice = (product) => {
  if (product === undefined || product.price === undefined || product.price.value === undefined) {
    return 0
  }
  return product.price.value
}

module.exports = {
  findParentCategory,
  findParentRank,
  findChildCategory,
  findChildRank,
  findSellerPage,
  findCompanyCountry,
  findThumbnail,
  findReviewCount,
  findReviewScore,
  findBestSellersRank,
  findPrice,
  findBrand,
  findNumberOfOtherSellers,
}
