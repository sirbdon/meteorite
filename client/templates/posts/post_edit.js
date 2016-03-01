Template.postEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentPostId = this._id;
    var postProperties = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    }

    Meteor.call('postUpdate', currentPostId, postProperties, function(error, result) {
      // display error and abort
      if (error) return throwError(error.reason);
      console.log("post_edit result: " + result);
      // if url exists, show error and route to existing post
      if (result.postExists) throwError('The UR L already exists!');
      console.log(result.postExists);
      Router.go('postPage', {_id: result._id});
    });
  },  
    
  //   // CHECK FOR EXISTING URL ON EDIT
  //   var duplicateUrlResult = false;

  //   Meteor.call('duplicateUrlCheck', postProperties.url, function(error, result) {
  //     // if error return error to console
  //     if (error) return console.log(error);
  //     console.log("edit URL check called: " + JSON.stringify(result, null, 2));
      
  //     // if post exists alert user and return flag to exit submit form function
  //     if (result.postExists) {
  //       console.log("url exists: " + result.postExists);
  //       Router.go('postPage', {_id: result._id});
  //       duplicateUrlResult = result.postExists;
  //       console.log("Duplicate in? " + JSON.stringify(duplicateUrlResult, null, 2));
  //       return duplicateUrlResult
  //     }
  //   });
  //   // exit submit form function before update executes
  //   console.log("Duplicate out? " + JSON.stringify(duplicateUrlResult, null, 2));
  //   if (duplicateUrlResult) { return alert('Ya, that URL exists already idiot'); }

  //   // ELSE, UPDATE POST PROPERTIES
  //   Posts.update(currentPostId, {$set: postProperties}, function(error) {
  //     if (error) {
  //     // display the error to the user
  //       throwError(error.reason);
  //     } else {
  //       Router.go('postPage', {_id: currentPostId});
  //     }
  //   });
  // },

  'click .delete': function(e) {
    e.preventDefault();
    
    if (confirm("Delete this post?")) {
      var currentPostId = this._id;
      Posts.remove(currentPostId);
      Router.go('postsList');
    }
  }
});