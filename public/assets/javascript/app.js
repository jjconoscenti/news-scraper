$(document).ready(function(){

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();

  // Click Listener for FORM SUBMISSION to ADD a comment
  $('.add-comment-button').on('click', function(){

    // Get _id of comment to be deleted
    var articleId = $(this).data("id");
    var baseURL = window.location.origin;
    var frmName = "form-add-" + articleId;
    var frm = $('#' + frmName);

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: frm.serialize(),
    })
    .done(function() {
      location.reload();
    });
    return false;
  });


  $('.delete-comment-button').on('click', function(){
    var commentId = $(this).data("id");
    var baseURL = window.location.origin;

    // ajax call used to delete a comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
    .done(function() {
      // refresh when call is done!
      location.reload();
    });
    return false;

  });

});