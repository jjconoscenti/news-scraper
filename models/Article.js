var moment = require("moment");
var mongoose = require('mongoose');

// create a schema class
var Schema = mongoose.Schema;

// create article schema
var ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  updated: {
    type: String,
    default: moment().format('MMMM Do YYYY, h:mm A')
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]

});

var Article = mongoose.model('Article', ArticleSchema);

// export
module.exports = Article;