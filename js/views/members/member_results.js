//Our view of the member results page
//Takes in a collection as a model, which is either a collection of 
//Divisions/Departments/Schools... or a collection of members
window.MemberResultsPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('members/member_results'));
	},
	render: function (eventName) {
		var self = this,
			letterAt;
		//get the first letter of the first result and build the search bar if we are on members page
		if (CAMI.searchType === "") {
			letterAt = filteredMembers[0].attributes.lastName.charAt(0);
			$(self.el).html(self.template());
		} else {
			letterAt = self.model.models[0].attributes.name.charAt(0);
			$(self.el).html("");
		}
		var results = "<div id='resultScroll'><dl><dt id='nav-" + letterAt + "' name='" + letterAt + "'>" + letterAt + "</dt>",
			buttonTemplate = _.template(templateLoader.get('members/member_list_item')),
			list;
		//are we looping through members or a field collection?
		list = CAMI.searchType === "" ? filteredMembers : self.model.models;
		//loop through and add to our result string
		$.each(list, function (i, member) {
			var attr = member.attributes,
				firstChar = CAMI.searchType === "" ? attr.lastName.toUpperCase().charAt(0) : attr.name.toUpperCase().charAt(0);
			if (firstChar !== letterAt) {
				results += "</dl><dl><dt name='" + firstChar + "' id='nav-" + firstChar + "'>" + firstChar + "</dt>";
				letterAt = firstChar;
			}
			if (CAMI.searchType === "") {
				results += buttonTemplate({
					name: CAMI.htmlEscape(attr.lastName + ", " + attr.firstName),
					link: "#memberinfo/" + attr.memberID
				});
			} else {
				results += buttonTemplate({
					name: CAMI.htmlEscape(attr.name),
					link: '#memberresults/0'
				});
			}
		});
		results += "</dl></div>";
		$(self.el).append(results);
		return self;
	}
});

//This function is called when the user clicks on a link in the member results page
function itemClicked(name, link) {
	CAMI.searchName = name;
	window.location.href = link;
}
//This function is called when the user clicks the magnifying glass to search
function filterMembers() {
	//filter the members for members whose first or last name or first+last name starts with what has been searched
	var searchString = $("#searchBar").val(),
		tempMembers = _.filter(searchedMembers, function (model) {
			return startsWith(model.attributes.firstName, searchString)
				|| startsWith(model.attributes.lastName, searchString)
				|| startsWith(model.attributes.firstName + " " + model.attributes.lastName, searchString);
		});
	if (tempMembers.length === 0) {
		navigator.notification.alert('Your search did not return any results.', function () {}, "No Results");
	} else {
		filteredMembers = tempMembers;
		app.currentPage.render();
	}
}
function startsWith(str, prefix) {
	return str.toUpperCase().indexOf(prefix.toUpperCase()) === 0;
}
//this function is called when the user clicks on a letter in the alpha scroll
function scrollToLetter(id) {
	document.getElementById(id).scrollIntoView();
}