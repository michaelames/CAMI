//Our view of the shared resources search menu page
window.SharedResourcesSearchPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('shared_resources/shared_resources_search'));
	},
	render: function (event) {
		var self = this,
			appendString = "<div class='menu'>";
		$(this.el).html(this.template({}));
		$.each(sharedResourceCollection.models, function (i, resource) {
            appendString += new SharedResourceButton({id: resource.attributes.SharedResourceID, name: resource.attributes.sharedResourceName}).render().el.innerHTML;
        });
		appendString += "</div>";
        $(self.el).append(appendString);
        return this;
	}
});
window.SharedResourceButton = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('shared_resources/shared_resources_button'));
	},
	tagName: 'a',
	className: 'menu-btn',
	render: function (event) {
		$(this.el).html(this.template({id: this.options.id, name: this.options.name}));
		return this;
	}
});