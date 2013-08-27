/***********
Contains functionality to load our app
Sets up the templates and global collections/variables
Creates our router and starts our history
***********/

// Set up the namespace for the application. Eventually all app-specific vars and functions should be placed in here.
window.CAMI = window.CAMI || {};

// Fill the namespaced class CAMI with our properties and methods
(function(CAMI, $, undefined) {

	//variables letting us know what members to show based on the type/name e.g. School/Univ. of Colorado
	CAMI.searchName = '',
	CAMI.searchType = '',

	// Save the user's last clinical trials search parameters
	CAMI.institution = '',
	CAMI.diseaseGroup = '',
	CAMI.phase = '',
	CAMI.coopGroup = '',
	CAMI.bioMarker = false,
	CAMI.isTouchDevice = null,

	// Escapes strings for html by getting rid of apostrophes
	CAMI.htmlEscape = function (str) {
		return String(str).replace(/'/g, '');
	},

	// Checks the device to see if we have an Internet connection or not
	CAMI.haveInternet = function () {
		return navigator.onLine;
	},

	// Returns the current date-time in the format mm/dd/yyyy hh:mm PM/AM
	CAMI.formatDate = function (date) {
		var month   = date.getMonth() + 1,
			day     = date.getDate(),
			year    = date.getFullYear(),
			hours   = date.getHours(),
			minutes = date.getMinutes(),
			suffix  = "AM";

		if (minutes < 10) minutes = "0" + minutes;
		if (hours > 11) suffix = "PM";
		if (hours > 12) hours -= 12;

		return month + "/" + day + "/" + year + " " + hours + ":" + minutes + "&nbsp;" + suffix;
	},

	// Gets the current device info and adds a class to the body to indicate the device.
	// Tracks whether this is a touch-enabled device or not, and returns true/false for it.
	CAMI.getDevice = function () {
		if (CAMI.isTouchDevice === null) {
			if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {
				var deviceType = '';
				if (navigator.userAgent.match(/iPhone/i))
					deviceType = 'iPhone';
				else if (navigator.userAgent.match(/iPad/i))
					deviceType = 'iPad';
				else if (navigator.userAgent.match(/Android/i))
					deviceType = 'Android';
				else
					deviceType = 'UnkownDevice';

				$('body').addClass(deviceType);
				CAMI.isTouchDevice = true;
				console.log("Device platform : " + deviceType);
			}
		}
		return CAMI.isTouchDevice;
	},

	// Determine if we are on an Android or not. Returns a boolean.
	CAMI.onAndroid = function () {
		return navigator.userAgent.toLowerCase().indexOf('android') > -1;
	}
	
}( window.CAMI = window.CAMI || {}, Zepto ));

var myScroll; // Global scrolling container

// Search collections
var phaseCollection          = new PhaseCollection();
var coopGroupCollection      = new CoopGroupCollection();
var diseaseSiteCollection    = new DiseaseSiteCollection();
var siteCollection           = new SiteCollection();
var schoolCollection         = new SchoolCollection();
var departmentCollection     = new DepartmentCollection();
var divisionCollection       = new DivisionCollection();
var institutionCollection    = new InstitutionCollection();
var rankCollection           = new RankCollection();
var primaryProgramCollection = new PrimaryProgramCollection();
var memberCollection         = new MemberCollection();
var clinicalTrialCollection  = new ClinicalTrialCollection();
var sharedResourceCollection = new SharedResourceCollection();

// The following hold filtered results in memory for better performance
var searchedMembers      = [];
var filteredMembers      = [];
var clinicalTrialResults = [];

//Loads all of our html templates into an array
var templateLoader = {
	templates: {},
	toLoad: 0,

	// Takes a list of template names, loads them, and calls the passed in callback upon completion.
	loadTemplates: function (names, callback) {
		var deferreds = [],
			self = this;
		this.toLoad = names.length;

		$.each(names, function (index, name) {
			deferreds.push($.get('templates/' + name + '.html', function (data) {
				self.templates[name] = data;
				if (--self.toLoad === 0) callback();
			}, "text"));
		});
	},

	// Get template by name from hash of preloaded templates
	get: function (name) {
		return this.templates[name];
	}
};


// Instantiates the iScroll library, call when the DOM is ready
function instantiateScroller() {
	myScroll = new iScroll('content-wrapper', { checkDOMChanges: false });
	myScroll.manualHeightSet = function (page, divName) {
		var content = document.getElementById(divName);
		if (content !== null) {
			content.style.height = "auto";
			var height = page.el.scrollHeight;
			content.style.height = height + "px";
		}
	}
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

// This will be executed when it's safe to make calls Cordova methods
function onDeviceReady() {
	CAMI.getDevice();
	CAMI.AppDataService.loadData();
	instantiateScroller();
	templateLoader.loadTemplates(
		[
			'home/home',
			'settings/settings',
			'members/member_search',
			'members/member_results',
			'members/member_info',
			'members/member_list_item',
			'clinical_trials/clinical_trial_search',
			'clinical_trials/clinical_trial_info',
			'clinical_trials/clinical_trial_results',
			'clinical_trials/clinical_trial_result_button',
			'shared_resources/shared_resources_info',
			'shared_resources/shared_resources_search',
			'shared_resources/shared_resources_button'
		],
		function () {
			app = new AppRouter();
			Backbone.history.start();
		}
	);

	// Attach global event handlers as needed. For view-specific event handlers, do this in the view
	$('#about-back-button').tap(function () { history.go(-1); });
	if (!CAMI.isTouchDevice) {
		$('#about-back-button').click(function () { history.go(-1); });
	}
	// Add a fallback for fancy alert dialogs, since we aren't running Cordova/PhoneGap. TODO: Add a check.
	navigator.notification = { alert: function (message, callback, title, buttonName) { alert(message); } }

	document.getElementById('content').addEventListener('webkitTransitionEnd', function () { 
		$('.stage-right, .stage-left').remove(); 
		$('.page').attr('class', 'page page-post-transition stage-center transition');
	}, false);
}

// Finally, check for a ready state, depending on the platform, and bootstrap the app.
onDeviceReady();
