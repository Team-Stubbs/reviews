const mongoose = require('mongoose');
const { Review, Photos, Col, metadata, dataBase } = require('./index.js');


const getLastReview = () => {
  return Col.find({}).sort({"reviews.id": -1}).limit(1);
};

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

const findMetaByProductId = (num) => {
  return new Promise((resolve, reject) => {
    metadata.findOne({ product_id: num }, (err, result) => {
      if (err || result === null) {
        reject(err || 'NO METADATA HERE');
      } else {
        let formmattedMeta = JSON.parse(JSON.stringify(result));
        let newCharacteristics = {};
        for (var key in formmattedMeta.characteristics) {
          newCharacteristics[key] = { id: formmattedMeta.characteristics[key][0].id };
          let total = 0;
          for (var i = 0; i < formmattedMeta.characteristics[key].length - 1; i++) {
            total += formmattedMeta.characteristics[key][i].value;
          }
          newCharacteristics[key].value = Math.round(total / formmattedMeta.characteristics[key].length * 10) / 10;
        }
        formmattedMeta.characteristics = newCharacteristics;
        resolve(formmattedMeta);
      }
    })
  })
};

const updateHelpfulByReviewId = (num) => {
  const filter = { "reviews.id": num };
  return new Promise((resolve, reject) => {
    Col.findOne(filter, (err, result) => {
      if (err || result === null) {
        reject(err || 'NO REVIEWS HERE');
      } else {
        let formatted = JSON.parse(JSON.stringify(result));
        for (var i = 0; i < formatted.reviews.length; i++) {
          if (formatted.reviews[i].id === num) {
            var updated = formatted.reviews[i].helpfulness += 1;
          }
        }
        dataBase.db.collection('col', function (err, collection) {
          collection.updateOne({ "reviews.id": num }, { $set: { 'reviews.$.helpfulness': updated } }, (error, results) => {
            if (error) {
              reject(error);
            } else {
              console.log(results);
              resolve(results);
            }
          })
        })
      }
    })
  })
};

const postReviewByProductId = (obj) => {
  return new Promise((resolve, reject) => {
    const wait = async _ => {
      let lastReview = await getLastReview();
      console.log(lastReview);
    }
    wait();
  })
}



module.exports = { findProductById, findMetaByProductId, updateHelpfulByReviewId, postReviewByProductId };