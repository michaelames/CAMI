//Our model representing a member
window.Member = Backbone.Model.extend({
    url: function () {
		return "/members/" + this.attributes.memberID;
	}
});