//Our view showing the information about a clinical trial
//Takes in a clinical trial as a model
window.ClinicalTrialInfoPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('clinical_trials/clinical_trial_info'));
	},
	render: function (event) {
		var json = this.model.attributes,
			participatingSites = '';
		$.each(json.sites, function (i, site) {
			if (i > 0) {
				participatingSites += '<br />';
			}
			participatingSites += site;
		});
		json.participatingSites = participatingSites;
		$(this.el).html(this.template(json));
        return this;
	}
});