window.SharedResourcesInfoPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('shared_resources/shared_resources_info'));
	},
	render: function (event) {
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
	}
});