var mongoose = require('mongoose');

// create a schema class
var Schema = mongoose.Schema;

// Create comment schema
var CommentSchema = new Schema({

  // author's name
  author: {
    type: String
  },
  // comment content
  content: {
    type: String
  }

});

// make the comment model
var Comment = mongoose.model('Comment', CommentSchema);

// export model
module.exports = Comment;