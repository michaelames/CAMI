//Our model representing a clinical trial
window.ClinicalTrial = Backbone.Model.extend({
	url: function () {
		return "/trials/" + this.attributes.trialID;
	}
});