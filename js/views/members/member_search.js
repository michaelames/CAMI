//Our view of the member search menu page
window.MemberSearchPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('members/member_search'));
	},
	render: function (event) {
		$(this.el).html(this.template({}));
        return this;
	}
});