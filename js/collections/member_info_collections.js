//Collections to hold our list of terms
window.SchoolCollection = Backbone.Collection.extend({
	model: School,
	comparator: function (school) {
		return school.get("name");
	},
	populate: function () {
		var self = this;
		//if we already populated, don't do it again
		if (self.length > 0) {
			return;
		}
		var names = getInfoFromMembers("school");
		$.each(names, function (i, name) {
			self.push(new School({name: name}));
		});
	}
});
window.DivisionCollection = Backbone.Collection.extend({
	model: Division,
	comparator: function (division) {
		return division.get("name");
	},
	populate: function () {
		var self = this;
		//if we already populated, don't do it again
		if (self.length > 0) {
			return;
		}
		var names = getInfoFromMembers("division");
		$.each(names, function (i, name) {
			self.push(new Division({name: name}));
		});
	}
});
window.DepartmentCollection = Backbone.Collection.extend({
	model: Department,
	comparator: function (department) {
		return department.get("name");
	},
	populate: function () {
		var self = this;
		//if we already populated, don't do it again
		if (self.length > 0) {
			return;
		}
		var names = getInfoFromMembers("department");
		$.each(names, function (i, name) {
			self.push(new Department({name: name}));
		});
	}
});
window.RankCollection = Backbone.Collection.extend({
	model: Rank,
	comparator: function (rank) {
		return rank.get("name");
	},
	populate: function () {
		var self = this;
		//if we already populated, don't do it again
		if (self.length > 0) {
			return;
		}
		var names = getInfoFromMembers("facultyRack");
		$.each(names, function (i, name) {
			self.push(new Rank({name: name}));
		});
	}
});
window.PrimaryProgramCollection = Backbone.Collection.extend({
	model: PrimaryProgram,
	comparator: function (program) {
		return program.get("name");
	},
	populate: function () {
		var self = this;
		//if we already populated, don't do it again
		if (self.length > 0) {
			return;
		}
		var names = getInfoFromMembers("primaryProgram");
		$.each(names, function (i, name) {
			self.push(new PrimaryProgram({name: name}));
		});
	}
});
window.InstitutionCollection = Backbone.Collection.extend({
	model: Institution,
	comparator: function (institution) {
		return institution.get("name");
	},
	populate: function () {
		var self = this;
		//if we already populated, don't do it again
		if (self.length > 0) {
			return;
		}
		var names = getInfoFromMembers("institution");
		$.each(names, function (i, name) {
			self.push(new Institution({name: name}));
		});
	}
});
//Get all unique strings from the field of members
function getInfoFromMembers(field) {
	var names = [];
	$.each(memberCollection.models,
		//push all unique strings
		function (i, member) {
			if ($.inArray(member.attributes[field], names) === -1 && member.attributes[field] !== "" && member.attributes[field].charAt(0) !== "(") {
				names.push(member.attributes[field]);
			}
		}
	);
	return names;
}
