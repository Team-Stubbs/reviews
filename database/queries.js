const mongoose = require('mongoose');
const { Review, Photos, Col } = require('./index.js');

const findProductById = (product_id, page, count, sort) => {
  return new Promise((resolve, reject) => {
    Col.findOne({ "product_id": product_id }, (err, document) => {
      if (err || document === null) {
        reject(err || 'REVIEW ID IS NOT DEFINED');
      } else {
        let readyDocument = JSON.parse(JSON.stringify(document)),
            index = page * count,
            lastIndex = (page - 1) * count;

        if (sort) {
          if (sort === 'newest') { readyDocument.reviews = readyDocument.reviews.sort((a, b) => { return new Date(b.date) - new Date(a.date) }) }
          if (sort === 'helpful') { readyDocument.reviews = readyDocument.reviews.sort((a, b) => { return b.helpfulness - a.helpfulness }) }
          if (sort === 'relevant') { readyDocument.reviews = readyDocument.reviews.sort((a, b) => { return b.helpfulness - a.helpfulness || new Date(b.date) - new Date(a.date) }) }
        }
        //if sort, sort document by sort parameter set as new reviews
        if (page && count) { readyDocument.page = page; readyDocument.count = count; readyDocument.results = readyDocument.reviews.slice(lastIndex, index); delete readyDocument.reviews }
        //if page and count return rows from end of last page up to end of current page
        if (page && !count) { readyDocument.page = page; readyDocument.results = readyDocument.reviews.slice(0, 5); delete readyDocument.reviews }
        //if not count return first five rows
        if (!page && count) { readyDocument.count = count; readyDocument.results = readyDocument.reviews.slice(0, count); delete readyDocument.reviews }
        //if not page return rows up to count
        if (!page && !count) { readyDocument.results = readyDocument.reviews.slice(0, 5); delete readyDocument.reviews }
        //if not page or count return first five reviews
        resolve(readyDocument);
        //resolve mutated document
      }
    })
  })
};

module.exports = { findProductById };