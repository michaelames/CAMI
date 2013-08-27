//Our view to show the clinical trial search page
window.ClinicalTrialSearchPage = Backbone.View.extend({
	initialize: function () {
		this.template = _.template(templateLoader.get('clinical_trials/clinical_trial_search'));
	},
	render: function (event) {
		$(this.el).html("");
		$(this.el).html(this.template({}));
		return this;
	},
	setupBioMarker: function () {
		var bio = $("#biomarker");
		var bioCheckbox = bio.children("input")[0];

		if (CAMI.bioMarker) {
			bio.toggleClass("on");
		}

		//if the switch is initially on, check the checkbox
		if (bio.hasClass("on")) {
			bioCheckbox.checked = true;
		}
		//when they click the button, change the css class and check/uncheck the checkbox
		bio.click(function () {
			bio.toggleClass("on");
			bio.toggleClass("off");
			bioCheckbox.checked = !bioCheckbox.checked;
		});
	},
	setupDropDownMenus: function () {
		populateDropDownMenu(siteCollection.models, "#institution", CAMI.institution);
		populateDropDownMenu(diseaseSiteCollection.models, "#diseaseSite", CAMI.diseaseGroup);
		populateDropDownMenu(phaseCollection.models, "#phase", CAMI.phase);
		populateDropDownMenu(coopGroupCollection.models, "#coopGroup", CAMI.coopGroup);
		// Delay and start doing some of the weird fixes for Android
		setTimeout(fixAndroidDropdowns, 2000);
	}
});

//populate drop down menu 'id' with the names in 'models'
function populateDropDownMenu(models, id, currentSelection) {
	var dropdown = $(id);
	dropdown.append("<option value='Any'>Any</option>");
	$.each(models, function (i, model) {
		var name = model.attributes.name;
		var selected = CAMI.htmlEscape(name) === currentSelection ? " selected" : "";
		dropdown.append('<option value="' + CAMI.htmlEscape(name) + '"' + selected + '>' + name + "</option>");
	});
}

// Designed to fix some of the weirdness surround Android 2.x bugs with dropdowns
function fixAndroidDropdowns() {
	var instDD = $('#institution');
	instDD.css({
		position: 'relative',
		zIndex: 999,
		visibility: 'visible'
	});	
	instDD.data('force-update', 'true');
	instDD.data('force-update', 'forced');
	$('.trials-search').append('&nbsp;');
}

//called when the user clicks search
function searchTrials() {
	CAMI.institution = $("#institution").val();
	CAMI.diseaseGroup = $("#diseaseSite").val();
	CAMI.phase = $("#phase").val();
	CAMI.coopGroup = $("#coopGroup").val();
	CAMI.bioMarker = $("#biomarker-checkbox")[0].checked;

	clinicalTrialResults = _.filter(clinicalTrialCollection.models, function (model) {
		//check institution
		var matchingInstitution = CAMI.institution === "Any";
		$.each(model.attributes.sites, function (i, site) {
			if (CAMI.htmlEscape(site) === CAMI.institution) {
				matchingInstitution = true;
			}
		});
		//check disease site
		var matchingDiseaseGroup = CAMI.diseaseGroup === "Any" || CAMI.htmlEscape(model.attributes.diseaseGroup) === CAMI.diseaseGroup;
		//check phase
		var matchingPhase = CAMI.phase === "Any" || CAMI.htmlEscape(model.attributes.phase) === CAMI.phase;
		//check coop group
		var matchingCoopGroup = CAMI.coopGroup === "Any" || (CAMI.htmlEscape(model.attributes.sponsor) === CAMI.coopGroup && model.attributes.coopGroup);
		//check biomarker
		var matchingBioMarker =
			(CAMI.bioMarker === true && model.attributes.bioMarker.charAt(0) === "Y")
			|| (CAMI.bioMarker === false && model.attributes.bioMarker.charAt(0) === "N");
		return matchingInstitution && matchingDiseaseGroup && matchingPhase && matchingCoopGroup && matchingBioMarker;
	});
	if (clinicalTrialResults.length === 0) {
		navigator.notification.alert("No results found. Try changing your search criteria.", function () {}, "No Results");
	} else {
		window.location.href = "#trialresults";
	}
}
