//Our model representing a shared resource
window.SharedResource = Backbone.Model.extend({
	url: function () {
		return "/resource/" + this.SharedResourceID;
	}
});