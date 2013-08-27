//Collection to hold a group of clinical trials
window.ClinicalTrialCollection = Backbone.Collection.extend({
    model: ClinicalTrial,
    //sort trials by name
    comparator: function (trial) {
        return trial.name;
    },
    //parse trials that are fetched to return an array of models
    parse: function (data) {
        this.reset();
        var trials = [];
        //for each member returned, push onto the collection
        $.each(data.GetAllTrialsResult,
            function (i, trial) {
                var new_trial = new ClinicalTrial({
                    bioMarker : trial["BioMarker"],
                    contactEmail : trial["Contact Email"],
                    contactName : trial["Contact Name"],
                    contactPhone : trial["Contact Phone"],
                    coopGroup : trial["CoopGroup"],
                    diseaseGroup : trial["Disease Group"],
                    eligibility : trial["Eligibility"],
                    irbNumber : trial["IRB Number"],
                    name : trial["Name"],
                    objective : trial["Objective"],
                    primaryPI : trial["Primary PI"],
                    sites : trial["Sites"],
                    sponsor : trial["Sponsor"],
                    trialID : trial["TrialId"],
                    phase : trial["Phase"]
                });
                //this wasn't working when in the above statement.... no idea why
                new_trial.attributes.investigator = trial["MemberID"];
                trials.push(new_trial);
            }
        );
		return trials;
    },
    url: function () {
        return "http://risr.org/CUServices.svc/GetTrials";
    }
});
