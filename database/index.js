const mongoose = require('mongoose');
const db = 'mongodb://127.0.0.1:27017/reviewList';

mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

const dataBase = mongoose.connection;
dataBase.on('error', console.error.bind(console, 'connection error'));
dataBase.once('open', () => {
  console.log('database is connected')
});

let reviewSchema = new mongoose.Schema({});
let photoSchema = new mongoose.Schema({});
let colSchema = new mongoose.Schema({});
let MetaDataSchema = new mongoose.Schema({});
let MetaSchema = new mongoose.Schema({});
const Photos = mongoose.model('Photos', photoSchema, 'photos');
const Review = mongoose.model('Review', reviewSchema, 'reviews');
const Col = mongoose.model('Col', colSchema, 'col');
const MetaData = mongoose.model('MetaData', MetaDataSchema, 'metaData');
const Meta = mongoose.model('Meta', MetaSchema, 'meta');


module.exports = {Photos, Review, Col, MetaData, Meta};