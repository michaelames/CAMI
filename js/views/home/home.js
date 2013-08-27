//Our view of our home page
window.HomePage = Backbone.View.extend({
	initialize: function () {
		var homeTemplate = templateLoader.get('home/home');
		this.template = _.template(homeTemplate);
	},
	render: function (event) {
		$(this.el).html(this.template({}));
        return this;
	}
});
//called when the user clicks the members button
function memberSearch() {
	if (memberCollection.length === 0) {
		navigator.notification.alert("No member records have been loaded. Go to the Settings page to retrieve the data.", function () {}, "No Data");
	} else {
		window.location.href = "#membersearch";
	}
}
//called when the user clicks the clinical trials button
function trialSearch() {
	if (clinicalTrialCollection.length === 0) {
		navigator.notification.alert("No clinical trials have been loaded. Go to the Settings page to retrieve the data.", function () {}, "No Data");
	} else {
		window.location.href = "#trialsearch";
	}
}
//called when the user clicks the shared resources button
function resourceSearch() {
	if (sharedResourceCollection.length === 0) {
		navigator.notification.alert("No shared resources have been loaded. Go to the Settings page to retrieve the data.", function () {}, "No Data");
	} else {
		window.location.href = "#sharedresourcesearch";
	}
}