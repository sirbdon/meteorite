var postData = [
	{
		title: "Brandon's Meteor App",
		url: "http://google.ca"
	},
	{
		title: "fuck shit",
		url: "http://dontgohere.com"
	},
	{
		title: "A third one",
		url: "http://www.fake.com/fakeme"
	}
];

Template.postsList.helpers({
	posts: postData
});
