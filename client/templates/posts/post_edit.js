Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    
    // CHECK FOR EXISTING URL ON EDIT
    var duplicateUrlResult = {};

    Meteor.call('duplicateUrlCheck', postProperties.url, function(error, result) {
      // if error return error to console
      if (error) return console.log(error);
      duplicateUrlResult = result;
    })

    // if url is duplicate show post exists and route to existing page
    // do not update post (remains the same)
    if (duplicateUrlResult.postExists) {
      alert('Ya that URL exists already idiot');
      console.log(result.postExists);
      Router.go('postPage', {_id: result._id});
      return;
    }

    // ELSE, UPDATE POST PROPERTIES
    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
      // display the error to the user
        alert(error.reason);
      } else {
        Router.go('postPage', {_id: currentPostId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});