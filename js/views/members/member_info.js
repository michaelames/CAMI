//Our view of the member page
//Takes a member as a model
window.MemberInfoPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('members/member_info'));
	},
	render: function (event) {
		$(this.el).html(this.template(this.model.toJSON()));
        return this;
	}
});