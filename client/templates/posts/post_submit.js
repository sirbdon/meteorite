Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };

    Meteor.call('postInsert', post, function(error, result) {

      // display error to user and abort
      if (error) return alert(error.reason);

      // show the post exists and route anyway
      if (result.postExists) alert('The fucking posts exists, asshole!');
      console.log(result.postExists);
      Router.go('postPage', {_id: result._id});
    });
  }
});