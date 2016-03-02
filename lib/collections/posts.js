Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) { return ownsDocument(userId, post); },
  remove: function(userId, post) { return ownsDocument(userId, post); },
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({
  duplicateUrlCheck: function(url, postId) {
    postId = postId || "";
    check(url, String);
    check(postId, String);

    var postWithSameLink = Posts.findOne({url: url});
    var editingSamePostUrl = postWithSameLink._id === postId;
    if (postWithSameLink && !editingSamePostUrl) {
      return {
        postExists: true,
        _id: postWithSameLink._id
      };
    }
    return { postExists: false };
  },

  postInsert: function(postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });

    // CHECK TITLE AND URL PRESENT
    var errors = validatePost(postAttributes);
    if (errors.title || errors.url)
      throw new Meteor.Error('invalid-post', "Gotta set a fucking title and URL man!");

    // CHECK IF URL EXISTS
    var duplicateUrlResult = {};

    Meteor.call('duplicateUrlCheck', postAttributes.url, function(error, result) {
      if (error) return console.log(error);
      duplicateUrlResult = result;
    });

    if (duplicateUrlResult.postExists) return duplicateUrlResult;

    // ADD ADDITIONAL POST ATTRIBUTES
    var user = Meteor.user();
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date() 
    });

    var postId = Posts.insert(post);

    return { _id: postId };
  },

  postUpdate: function(currentPostId, postAttributes) {
    check(Meteor.userId(), String);
    check(postAttributes, {
      title: String,
      url: String
    });
    check(currentPostId, String);

    // CHECK IF URL EXISTS
    var duplicateUrlResult = {};

    Meteor.call('duplicateUrlCheck', postAttributes.url, currentPostId, function(error, result) {
      if (error) return console.log(error);
      duplicateUrlResult = result;
    });

    if (duplicateUrlResult.postExists) return duplicateUrlResult;

    // ADD ADDITIONAL POST ATTRIBUTES

    Posts.update(currentPostId, {$set: postAttributes}, function(error) {
      if (error) return throwError(error.reason);
    });

    return { _id: currentPostId };
  }
});

validatePost = function(post) {
  var errors = {}

  if (!post.title) errors.title = "Please fill in a headline";
  if (!post.url) errors.title = "Please fill in a URL";

  return errors;
}








