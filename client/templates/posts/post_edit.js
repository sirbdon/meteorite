Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    
    // CHECK FOR EXISTING URL ON EDIT
    var duplicateUrlResult = false;

    Meteor.call('duplicateUrlCheck', postProperties.url, function(error, result) {
      // if error return error to console
      if (error) return console.log(error);
      console.log("edit URL check called: " + JSON.stringify(result, null, 2));
      
      // if post exists alert user and return flag to exit submit form function
      if (result.postExists) {
        console.log("url exists: " + result.postExists);
        Router.go('postPage', {_id: result._id});
        duplicateUrlResult = result.postExists;
      }
    })
    // exit submit form function before update executes
    if (duplicateUrlResult) { return alert('Ya that URL exists already idiot'); }

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