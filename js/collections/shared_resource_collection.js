//Collection to hold a group of members
window.SharedResourceCollection = Backbone.Collection.extend({
	model: SharedResource,
	//sort shared resources alphabetically by their name
	comparator: function (resource) {
		return resource.get("sharedResourceName").toUpperCase();
	},
	parse: function (data) {
		this.reset();
		var resources = [];
		//for each member returned, push onto the collection
		$.each(data.GetAllSharedResourcesResult,
			function (i, resource) {
				var new_resource = new SharedResource({
					contactEmail : resource["ContactEmail"],
					contactPhone : resource["ContactPhone"],
					services : resource["Services"],
					sharedResourceName : resource["SharedResourceName"],
					SharedResourceID : resource["SharedResourcesID"]
				});
				resources.push(new_resource);
			}
		);
		return resources;
	},
	url: function () {
		return "http://risr.org/CUServices.svc/GetSharedResources";
	}
});
