const express = require("express");
const app = express();
const port = 4001;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const { findProductById, findMetaByProductId, updateHelpfulByReviewId, postReviewByProductId } = require('../database/queries.js');
const { Review, Photos, Col, MetaData, Meta } = require('../database/index.js');
const mongoose = require('mongoose');
const fs = require('fs');

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

app.get('/reviews/meta', (req, res) => {
  let { product_id } = req.query;
  findMetaByProductId(Number(product_id))
  .then((metaData) => {
    res.send(metaData);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send();
  })
});

app.put('/reviews/helpful', (req, res) => {
  let { review_id } = req.query;
  updateHelpfulByReviewId(Number(review_id))
  .then((data) => {
    res.send(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(400).send();
  })
});

app.post('/reviews', (req, res) => {
  // let { query } = req,
  //     rating = query.rating || false,
  //     summary = query.summary || false,
  //     body = query.body || false,
  //     recommend = query.recommend || false,
  //     name = query.name || false,
  //     email = query.email || false,
  //     photos = query.photos || false,
  //     characteristics = query.characteristics || false;
  let review = req.body;
  postReviewByProductId(review)
  .then((data) => {
    // console.log(data)
    res.send();
  })
  .catch((err) => {
    consol.log(err);
  })
})


app.listen(port, () => console.log('listening'));

