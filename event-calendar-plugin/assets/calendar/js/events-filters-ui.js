"use strict";
/**
 * Copyright 2018 Tampere University of Technology, Pori Department
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


/**
 * Filters UI functions
 *
 * Requires: jquery (tested 1.12.4 and 3.3.1), jquery-ui (tested 1.12.1), events-ui.js
 */
var Events_Filters_UI = {
	DATA_ATTRIBUTE_ID : "data-filters-id",
	elementEndDate : null,
	elementKeywords : null,
	elementPlaces : null,
	elementProviderName : null,
	elementStartDate : null,
	elementText : null,
	limitKeywords : 50,
	limitPlaces : 50,
	locale : "fi",
	sortKeywords : "name", // sort criteria and order of keywords
	sortPlaces : "name", // sort criteria and order of places

	/**
	 * initialize
	 */
	initialize : function() {
		var container = document.getElementById("events-filters-ui");
		if(!container){
			console.warn("Element not found, id: events-filters-ui");
			return;
		}

		var script = document.getElementById("events-filters-ui-script");
		if(script){
			var temp = script.getAttribute("data-events-locale");
			if(temp){
				Events_Filters_UI.locale = temp;
			}

			temp = script.getAttribute("data-events-filters-text");
			if(temp && temp == "true"){
				Events_Filters_UI.elementText = document.createElement("input");
				Events_Filters_UI.elementText.id = "events-filters-ui-text";
				container.appendChild(Events_Filters_UI.elementText);
			}

			temp = script.getAttribute("data-events-filters-providerName");
			if(temp && temp == "true"){
				Events_Filters_UI.elementProviderName = document.createElement("input");
				Events_Filters_UI.elementProviderName.id = "events-filters-ui-provider_name";
				container.appendChild(Events_Filters_UI.elementProviderName);
			}

			temp = script.getAttribute("data-events-filters-date");
			if(temp && temp == "true"){
				var dContainer = document.createElement("div");
				dContainer.id = "events-filters-ui-date_container";

				Events_Filters_UI.elementStartDate = document.createElement("input");
				Events_Filters_UI.elementStartDate.id = "events-filters-ui-start_date";
				dContainer.appendChild(Events_Filters_UI.elementStartDate);
				jQuery(Events_Filters_UI.elementStartDate).datepicker(jQuery.datepicker.regional[Events_Filters_UI.locale]);
				temp = script.getAttribute("data-events-startDate");
				var startDate = null;
				if(temp){
					startDate = new Date(temp);
				}else{
					startDate = new Date();
				}
				jQuery(Events_Filters_UI.elementStartDate).datepicker("setDate", startDate);

				var dateDivider = document.createElement("span");
				dateDivider.appendChild(document.createTextNode(" - "));
				dContainer.appendChild(dateDivider);

				Events_Filters_UI.elementEndDate = document.createElement("input");
				Events_Filters_UI.elementEndDate.id = "events-filters-ui-end_date";
				dContainer.appendChild(Events_Filters_UI.elementEndDate);
				jQuery(Events_Filters_UI.elementEndDate).datepicker(jQuery.datepicker.regional[Events_Filters_UI.locale]);
				temp = script.getAttribute("data-events-endDate");
				if(temp){
					jQuery(Events_Filters_UI.elementEndDate).datepicker("setDate", new Date(temp));
				}else{
					jQuery(Events_Filters_UI.elementEndDate).datepicker("setDate", new Date(startDate.getTime()+2592000000)); // if
				}

				container.appendChild(dContainer);
			}

			temp = script.getAttribute("data-events-filters-places-limit");
			if(temp){
				Events_Filters_UI.limitPlaces = Number(temp);
			}
			temp = script.getAttribute("data-events-filters-places");
			if(temp){
				Events_Filters_UI.elementPlaces = document.createElement("div");
				Events_Filters_UI.elementPlaces.id = "events-filters-ui-places_list";
				container.appendChild(Events_Filters_UI.elementPlaces);
				Events_API_Place.get(Events_Filters_UI.placesLoaded, 1, Events_Filters_UI.limitPlaces, Events_Filters_UI.sortPlaces, null);
			}

			temp = script.getAttribute("data-events-filters-keywords-limit");
			if(temp){
				Events_Filters_UI.limitKeywords = Number(temp);
			}
			temp = script.getAttribute("data-events-filters-keywords");
			if(temp){
				Events_Filters_UI.elementKeywords = document.createElement("div");
				Events_Filters_UI.elementKeywords.id = "events-filters-ui-keywords_list";
				container.appendChild(Events_Filters_UI.elementKeywords);
				Events_API_Keyword.get(Events_Filters_UI.keywordsLoaded, 1, Events_Filters_UI.limitKeywords, Events_Filters_UI.sortKeywords, null);
			}
		}

		var doFilter = document.createElement("button");
		doFilter.id = "events-filters-ui-do_filter";
		doFilter.onclick = Events_Filters_UI.doFilter;
		container.appendChild(doFilter);
	},

	/**
	 * execute filter
	 */
	doFilter : function() {
		if(Events_Filters_UI.elementText){
			Events_UI.setText(Events_Filters_UI.elementText.value);
		}

		if(Events_Filters_UI.elementProviderName){
			Events_UI.setProviderName(Events_Filters_UI.elementProviderName.value);
		}

		if(Events_Filters_UI.elementPlaces){
			var ids = [];
			var selectors = Events_Filters_UI.elementPlaces.getElementsByClassName("events-filters-ui-place_selector");
			for(var i=0;i<selectors.length;++i){
				var s = selectors[i];
				if(s.checked){
					ids.push(s.getAttribute(Events_Filters_UI.DATA_ATTRIBUTE_ID));
				}
			}
			Events_UI.setLocations(ids);
		}

		if(Events_Filters_UI.elementKeywords){
			var ids = [];
			var selectors = Events_Filters_UI.elementKeywords.getElementsByClassName("events-filters-ui-keyword_selector");
			for(var i=0;i<selectors.length;++i){
				var s = selectors[i];
				if(s.checked){
					ids.push(s.getAttribute(Events_Filters_UI.DATA_ATTRIBUTE_ID));
				}
			}
			Events_UI.setKeywords(ids);
		}

		if(Events_Filters_UI.elementStartDate){
			var start = jQuery(Events_Filters_UI.elementStartDate).datepicker("getDate");
			var end = jQuery(Events_Filters_UI.elementEndDate).datepicker("getDate");
			if(end){
				end = new Date(end.getTime()+86400000); // datepicker returns the date at 00:00 in current locale. Move the date +24h to also include events from the end date
			}

			Events_UI.setDateInterval(start, end);
		}

		Events_UI.resetPaging();
		Events_UI.loadEvents();
	},

	/**
	 * called after places have been loaded
	 *
	 * @param {JSON} data
	 */
	placesLoaded : function(data) {
		Events_Filters_UI.elementPlaces.innerHTML = "";
		Events_Filters_UI.selectedPlaceIds = [];

		if(!data || !data.data){
			return;
		}

		for(var i=0;i<data.data.length;++i){
			var d = data.data[i];
			var label = document.createElement("label");
			label.className = "events-filters-ui-place_selector-label";

			var iElement = document.createElement("input");
			iElement.className = "events-filters-ui-place_selector";
			iElement.type = "checkbox";
			iElement.setAttribute(Events_Filters_UI.DATA_ATTRIBUTE_ID, d.id);
			label.appendChild(iElement);

			label.appendChild(document.createTextNode(d.name[Events_Filters_UI.locale]));
			Events_Filters_UI.elementPlaces.appendChild(label);
		}
	},

	/**
	 * called after keywords have been loaded
	 *
	 * @param {JSON} data
	 */
	keywordsLoaded : function(data) {
		Events_Filters_UI.elementKeywords.innerHTML = "";
		Events_Filters_UI.selectedKeywordIds = [];

		if(!data || !data.data){
			return;
		}

		for(var i=0;i<data.data.length;++i){
			var d = data.data[i];
			var label = document.createElement("label");
			label.className = "events-filters-ui-keyword_selector-label";

			var iElement = document.createElement("input");
			iElement.className = "events-filters-ui-keyword_selector";
			iElement.type = "checkbox";
			iElement.setAttribute(Events_Filters_UI.DATA_ATTRIBUTE_ID, d.id);
			label.appendChild(iElement);

			label.appendChild(document.createTextNode(d.name[Events_Filters_UI.locale]));
			Events_Filters_UI.elementKeywords.appendChild(label);
		}
	}
};

jQuery(document).ready(function() {
	Events_Filters_UI.initialize();
});
