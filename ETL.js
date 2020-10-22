const mongoose = require('mongoose');
const {Review, Photos, Col, MetaData, Meta} = require('./database/index.js');
const fs = require('fs');
const path = require('path');

const photoFinder = (num) => {
  return Photos.find({ review_id: num });
};

const reviewFinder = (num) => {
  return Review.find({ product_id: num });
};

const colChecker = (num) => {
  return Col.findOne({ product_id: num });
};

const metaDataFinder = (num) => {
  return MetaData.find({product_id: num});
};

const metaFinder = (num) => {
  return Meta.find({characteristic_id: num});
};

const reviewCollector = async _ => {
  console.log('started');
  let result = [];
  for (let i = 900000; i < 1000010; i++) {
    // console.log(`ON PRODUCT ID ${i}`);
    const currentReviews = await reviewFinder(i);
    if (currentReviews.length > 0) {
      let document = { product_id: Object.values(currentReviews[0])[5].product_id, reviews: []};
      for (var j = 0; j < currentReviews.length; j++) {
        const currentPhotos = await photoFinder(JSON.parse(JSON.stringify(currentReviews[j])).id);
        if (currentPhotos.length > 0) {
          let review = JSON.parse(JSON.stringify(currentReviews[j]));
          review.photo = JSON.parse(JSON.stringify(currentPhotos));
          document.reviews.push(review);
        } else {
          let review = JSON.parse(JSON.stringify(currentReviews[j]));
          document.reviews.push(review);
        }
      }
      result.push(document);
    }
  }
  fs.writeFile('./data.json', JSON.stringify(result), 'utf-8', function (err) {
    if (err) throw err
    console.log('Done!');
  })
};

// reviewCollector();

const metaDataCollector = async _ => {
  console.log('started');
    for(var i = 0; i < 2; i ++) {
    var finishedMetaData = {};
    var ratings = {};
    const currentProduct = await colChecker(i);
    var formattedProduct = JSON.parse(JSON.stringify(currentProduct));
    for(var j = 0; j < formattedProduct.reviews.length; j ++) {
      let row = formattedProduct.reviews[j];
      if(ratings[row.rating.toString()]) {
        ratings[row.rating.toString()]++;
      } else {
        ratings[row.rating.toString()] = 1;
      }
    }
    const currentMetaData = await metaDataFinder(i);
    var formmattedMeta = JSON.parse(JSON.stringify(currentMetaData));
    var characteristics = {};
    for(var k = 0; k < formmattedMeta.length; k ++) {
      const currentCharacteristics = await metaFinder(formmattedMeta[k].id);
      var formattedCharacteristics = JSON.parse(JSON.stringify(currentCharacteristics));
      var total = 0;
      for(var l = 0; l < formattedCharacteristics.length; l ++) {
        total += formattedCharacteristics[l].value;
        // characteristics.formmattedMeta[k].name = {id : formmattedMeta[k].id, value: currentCharacteristics.value}
      }
      currentCharacteristics.formmattedMeta[k].name = {id: formmattedMeta[k].id, value: total/currentCharacteristics}
    }
  }
  finishedMetaData.ratings = ratings;
  finishedMetaData.characteristics = characteristics;
  console.log(finishedMetaData);
};

metaDataCollector();

// const photoCollector = async _ => {
//   const allProducts = await reviewCollector();
//   console.log('MOVED TO PHOTOS');
//   for (var k = 0; k < allProducts.documents.length - 1; k++) {
//     var collection = Object.keys(allProducts.documents[k].reviews);
//     for (var l = 0; l < collection.length; l++) {
//       console.log(`ON PHOTO ID ${collection[l]}`)
//       const currentPhotos = await photoFinder(Number(collection[l]));
//       if (currentPhotos.length > 0) {
//         allProducts.documents[k].reviews[collection[l]].photos = JSON.parse(JSON.stringify(photo));
//       }
//     }
//   }

//   let finishedProducts = allProducts.documents;
//   fs.writeFile('./data.json', JSON.stringify(finishedProducts), 'utf-8', function (err) {
//     if (err) throw err
//     console.log('Done!');

//   })
// }

// photoCollector();

// const reviewCollector = async _ => {
//   let missingProducts = [];
//   for (let i = 0; i < 1000010; i++) {
//     const colProduct = await colChecker(i)
//     if (colProduct === null) {
//       console.log(`THIS PRODUCT ID ISNT THERE ${i}`);
//       missingProducts.push(i)
//     }
//   }
//   let result = { documents: [] };
//   for (let j = 0; j < missingProducts.length; j++) {
//     const currentReviews = await reviewFinder(j);
//     if (currentReviews.length > 0) {
//       let document = { product_id: Object.values(currentReviews[0])[5].product_id, reviews: {} };
//       for (var k = 0; k < currentReviews.length; k++) {
//         let obj = JSON.parse(JSON.stringify(currentReviews[k]));
//         document.reviews[JSON.parse(JSON.stringify(currentReviews[k])).id] = obj;
//       }
//       result.documents.push(document);
//     }
//   }
//   return result;
// };


// console.log(JSON.stringify(...some));
// fs.readFile('./data.json', 'utf-8', function (err, data) {
//   if (err) throw err

// var arrayOfObjects = []
// arrayOfObjects.push(...some);


// })

// fs.writeFile('./data.json', JSON.stringify(done), 'utf-8', function (err) {
//   if (err) throw err
//   console.log('Done!')
// })