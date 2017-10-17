var express = require('express');
var router = express.Router();
var path = require('path');
var request = require('request');
var cheerio = require('cheerio');

// importing comment and article models
var Comment = require('../models/Comment.js');
var Article = require('../models/Article.js');

// render the index page on first visit to the site
router.get('/', function (req, res){
  res.redirect('/scrape');
});

// articles render
router.get('/articles', function (req, res){
  Article.find().sort({_id: -1})
    .populate('comments')
    .exec(function(err, doc){
      if (err){
        console.log(err);
      } else {
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);
      }
    });

});

router.get('/scrape', function(req, res) {

  // First, grab the body of the html with request
  request('https://www.gq.com/', function(error, response, html) {

    var $ = cheerio.load(html);

    var titlesArray = [];

    // Now, grab every everything with a class of "inner" with each "article" tag
    $('article .inner').each(function(i, element) {

        // Create an empty result object
        var result = {};

        // Collect the Article Title (contained in the "h2" of the "header" of "this")
        result.title = $(this).children('header').children('h2').text().trim() + ""; //convert to string for error handling later

        // Collect the Article Link (contained within the "a" tag of the "h2" in the "header" of "this")
        result.link = 'http://www.theonion.com' + $(this).children('header').children('h2').children('a').attr('href').trim();

        result.summary = $(this).children('div').text().trim() + "";
        if(result.title !== "" &&  result.summary !== ""){
          if(titlesArray.indexOf(result.title) == -1){
            titlesArray.push(result.title);
            Article.count({ title: result.title}, function (err, test){
              if(test == 0){
                var entry = new Article (result);
                entry.save(function(err, doc) {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(doc);
                  }
                });
              }
              else{
                console.log('Redundant Database Content. Not saved to DB.')
              }
            });
        } else {
          console.log('Redundant Onion Content. Not Saved to DB.')
        }
      } else {
        console.log('Empty Content. Not Saved to DB.')
      }
    });
    res.redirect("/articles");
  });
});

// Add a Comment Route - **API**
router.post('/add/comment/:id', function (req, res){

  // Collect article id
  var articleId = req.params.id;

  // Collect Author Name
  var commentAuthor = req.body.name;

  // Collect Comment Content
  var commentContent = req.body.comment;

  // "result" object has the exact same key-value pairs of the "Comment" model
  var result = {
    author: commentAuthor,
    content: commentContent
  };

  // Create a new comment entry
  var entry = new Comment (result);

  // Save the entry to db
  entry.save(function(err, doc) {
    // log errors
    if (err) {
      console.log(err);
    }
    // Or relate comment to article
    else {
      // Push new Comment to comment list
      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})
      // execute above query
      .exec(function(err, doc){
        // log errors
        if (err){
          console.log(err);
        } else {
          // Send success header
          res.sendStatus(200);
        }
      });
    }
  });
});

// Delete Comment route
router.post('/remove/comment/:id', function (req, res){

  // Collect comment id
  var commentId = req.params.id;

  // Find and Delete the Comment using the Id
  Comment.findByIdAndRemove(commentId, function (err, todo) {

    if (err) {
      console.log(err);
    }
    else {
      res.sendStatus(200);
    }

  });

});

module.exports = router;