const express = require("express");
const app = express();
const port = 4001;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { findProductById } = require('../database/queries.js');
const { Review, Photos, Col, MetaData, Meta } = require('../database/index.js');
const mongoose = require('mongoose');
app.get('/', (req, res) => {
  res.send("hello there");
});


app.get('/reviews', (req, res) => {
  let query = req.query,
    productId = Number(query.product_id) || false,
    page = Number(query.page) || false,
    count = Number(query.count) || false,
    sort = query.sort || false;

  var start = new Date().getTime();
  findProductById(productId, page, count, sort)
    .then(document => {
      res.send(document);
    })
    .then(() => {
      var end = new Date().getTime();
      console.log(end - start);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send();
    })
});

const colChecker = (num) => {
  return Col.findOne({ product_id: num });
};

const metaDataFinder = (num) => {
  return MetaData.find({ product_id: num });
};

const metaFinder = (num) => {
  return Meta.find({ characteristic_id: num });
};

const metaDataCollector = async _ => {
  console.log('started');
  for (var i = 0; i < 20; i++) {
    var finishedMetaData = {};
    var ratings = {};
    const currentProduct = await colChecker(i);
    var formattedProduct = JSON.parse(JSON.stringify(currentProduct));
    if (formattedProduct !== null) {
      for (var j = 0; j < formattedProduct.reviews.length; j++) {
        let row = formattedProduct.reviews[j];
        if (ratings[row.rating.toString()]) {
          ratings[row.rating.toString()]++;
        } else {
          ratings[row.rating.toString()] = 1;
        }
      }
      console.log(ratings, 'THIS IS RATINGS')
      const currentMetaData = await metaDataFinder(i);
      var formattedMeta = JSON.parse(JSON.stringify(currentMetaData));
      if (formattedMeta.length > 0) {
        console.log(formattedMeta, 'THIS IS FORMATTED DATA');
        var characteristics = {};
        for (var k = 0; k < formattedMeta.length; k++) {
          const currentCharacteristics = await metaFinder(formattedMeta[k].id);
          var formattedCharacteristics = JSON.parse(JSON.stringify(currentCharacteristics));
          if(formattedCharacteristics.length > 0) {

            console.log(formattedCharacteristics, "THIS IS THE THING")
            var total = 0;
            for (var l = 0; l < formattedCharacteristics.length; l++) {
              total += formattedCharacteristics[l].value;
              // characteristics.formattedMeta[k].name = {id : formattedMeta[k].id, value: currentCharacteristics.value}
            }
          }
          console.log(formattedCharacteristics.length)
          characteristics[formattedMeta[k].name] = { id: formattedMeta[k].id, value: total / formattedCharacteristics.length }
        }
        finishedMetaData.ratings = ratings;
        finishedMetaData.characteristics = characteristics;
        console.log(finishedMetaData);
      }
    }
  }
}

metaDataCollector();

app.listen(port, () => console.log('listening'));

