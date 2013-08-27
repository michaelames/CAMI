//Collection to hold a group of members
window.MemberCollection = Backbone.Collection.extend({
    model: Member,
    //sort members alphabetically by last name
	comparator: function (member) {
        return member.get("lastName").toUpperCase();
    },
    //parse members that are fetched into an array of models
    parse: function (data) {
        this.reset();
        var members = [];
        //for each member returned, push onto the collection
        $.each(data.GetAllMembershipsResult,
            function (i, member) {
                var new_member = new Member({
                    asOf : member.AsOf.substring(0, member.AsOf.length - 12),
                    campusBox : member.CampusBox,
                    department : member.Department,
                    division : member.Division,
                    email : member.Email,
                    facultyRack : member.FacultyRack,
                    fax : member.Fax,
                    firstName : member.FirstName,
                    institution : member.Institution,
                    lastName : member.LastName,
                    memberID : member.MemberID,
                    phone : member.Phone,
                    primaryProgram : member.PrimaryProgram,
                    secondaryProgram : member.SecondaryProgram,
                    school : member.School,
                    type : member.Type
                });
                members.push(new_member);
            }
        );
		return members;
    },
    url: function () {
        return "http://risr.org/CUServices.svc/GetMembers";
    }
});
