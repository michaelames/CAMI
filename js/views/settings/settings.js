//Our view to show our demo page containing information about the amount of data pulled
window.SettingsPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('settings/settings'));
	},
	render: function (event) {
		var date = "No Data Loaded";
		if (CAMI.AppDataService.lastUpdatedDate !== null && CAMI.AppDataService.lastUpdatedDate !== undefined) {
			date = CAMI.formatDate(CAMI.AppDataService.lastUpdatedDate);
		}
		if (CAMI.AppDataService.loadingMembers || CAMI.AppDataService.loadingTrials || CAMI.AppDataService.loadingResources) {
			date = "Loading...";
		}
		$(this.el).html(this.template({
			members: memberCollection.length,
			trials: clinicalTrialCollection.length,
			resources: sharedResourceCollection.length,
			lastUpdatedDate: date
		}));
        return this;
	}
});