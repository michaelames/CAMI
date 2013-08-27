//Our view to show the results from a clinical trial search
//Takes in a collection of trials as a model
window.ClinicalTrialResultsPage = Backbone.View.extend({
    tagName: 'div',
    id: 'clinical-trial-search-results',
    initialize: function () {
        this.template = _.template(templateLoader.get('clinical_trials/clinical_trial_results'));
        this.itemTemplate = _.template(templateLoader.get('clinical_trials/clinical_trial_result_button'));
    },
	render: function (eventName) {
        $(this.el).html("");
        var html = this.template({
            items: $(clinicalTrialResults),
            itemTemplate: this.itemTemplate
        });
        $(this.el).append(html);
        return this;
    }
});