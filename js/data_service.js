(function(CAMI, $, undefined) {
	CAMI.AppDataService = {
		//holds the last time that we updated data and booleans to check if we are currently downloading data
		lastUpdatedDate:        null,
		loadingMembers:         false,
		loadingTrials:          false,
		loadingResources:       false,
		HOURS_TO_LOAD_NEW_DATA: 24,

		loadData: function () {
			if (this.loadingMembers || this.loadingTrials || this.loadingResources) {
				return;
			}
			this.loadingMembers   = true;
			this.loadingTrials    = true;
			this.loadingResources = true;

			//reset all of our search collections
			schoolCollection.reset();
			departmentCollection.reset();
			divisionCollection.reset();
			institutionCollection.reset();
			rankCollection.reset();
			primaryProgramCollection.reset();
			phaseCollection.reset();
			diseaseSiteCollection.reset();
			siteCollection.reset();
			coopGroupCollection.reset();

			//if we have internet, call fetch from our services
			if (CAMI.haveInternet()) {
				console.log("Retrieving Data from the internet");
				CAMI.AppDataService.fetchCollection(memberCollection, function () {
					CAMI.AppDataService.loadingMembers = false;
				});
				CAMI.AppDataService.fetchCollection(clinicalTrialCollection, function () {
					CAMI.AppDataService.loadingTrials = false;
				});
				CAMI.AppDataService.fetchCollection(sharedResourceCollection, function () {
					CAMI.AppDataService.loadingResources = false;
				});
			} else {
				//if we don't have internet, retrieve our local storage objects
				console.log("Retrieving Data from localStorage");
				//try/catch so that if there is no local storage item yet, we don't fail
				try {
					var trials = JSON.parse(localStorage.getItem("clinicalTrialCollection"));
					$.each(trials, function (i, trial) {
						clinicalTrialCollection.push(trial);
					});
					var members = JSON.parse(localStorage.getItem("memberCollection"));
					$.each(members, function (i, member) {
						memberCollection.push(member);
					});
					var resources = JSON.parse(localStorage.getItem("sharedResourceCollection"));
					$.each(resources, function (i, resource) {
						sharedResourceCollection.push(resource);
					});
					this.lastUpdatedDate = new Date(JSON.parse(localStorage.getItem("CAMI.AppDataService.lastUpdatedDate")));
				} 
				catch (err) {
					console.log(err);
				}

				this.loadingTrials = false;
				this.loadingMembers = false;
				this.loadingResources = false;

				//update the settings page if we are looking at it
				if (AppRouter.currentPageName === "Settings") {
					AppRouter.currentPage.render();
				}
			}
		},

		//function to fetch a collection and call loading on error/success
		fetchCollection: function (collection, loading) {
			collection.fetch({
				type: "GET",
				contentType: "application/json; charset=utf-8",
				datatype: "json",
				async: true,
				error: function (collection, xhr, options) {
					navigator.notification.alert("Error retrieving data. Go to the Settings page to try loading data.", function () {}, "Data Problem");
					loading();
				},
				success: function () {
					loading();
					CAMI.AppDataService.doneLoading();
				}
			});
		},

		// Checks if we should load new data from the services and makes the call if we should
		checkLoadData: function () {
			if (this.lastUpdatedDate === null || this.lastUpdatedDate === undefined) {
				return;
			}
			var differenceInMilliseconds = (new Date()) - this.lastUpdatedDate,
				differenceInHours = differenceInMilliseconds / 3600000;
			if (differenceInHours > this.HOURS_TO_LOAD_NEW_DATA && CAMI.haveInternet()) {
				console.log("Haven't loaded data in a while, loading from services now");
				this.loadData();
			}
		},

		doneLoading: function () {
			//check if we are done downloading data
			if (!this.loadingMembers && !this.loadingTrials && !this.loadingResources) {
				this.lastUpdatedDate = new Date();
				localStorage.clear();
				localStorage.setItem("CAMI.AppDataService.lastUpdatedDate", JSON.stringify(this.lastUpdatedDate));
				localStorage.setItem("memberCollection", JSON.stringify(memberCollection));
				localStorage.setItem("clinicalTrialCollection", JSON.stringify(clinicalTrialCollection));
				localStorage.setItem("sharedResourceCollection", JSON.stringify(sharedResourceCollection));
			}
			//update the settings page if we are looking at it
			if (window.app != undefined && window.app.currentPageName === "Settings") {
				window.app.currentPage.render();
			}
		}
	};
}( window.CAMI = window.CAMI || {}, Zepto ));
