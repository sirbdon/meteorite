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
  duplicateUrlCheck: function(url) {
    check(url, String);

    var postWithSameLink = Posts.findOne({url: url});
    if (postWithSameLink) {
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
  }
});
