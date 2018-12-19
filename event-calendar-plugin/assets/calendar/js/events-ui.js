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
 * Event UI functions
 *
 * Requires: jquery (tested 1.12.4 and 3.3.1), events.js, keywords.js, places.js
 */
var Events_UI = {
	PAGE_SIZE : 10,
	bodyCollapsed : false, // if true, the body elements are created in "collapsed" mode
	currentPage : 1, // the current page number in the active result set
	elementCurrentPage : null,
	elementEventList : null,
	elementLastPage : null,
	filterStartDate : null,
	filterEndDate : null,
	filterKeywords : null, // array of strings
	filterLocations : null, // array of strings
	filterProviderName : null, // string, provider/organizer
	filterText : null,
	locale : "fi",
	lastPage : 0, // maximum page number for the active result set
	sortEvents : "start_time",  // sort criteria and order of events

	/**
	 * initialize
	 */
	initialize : function() {
		var container = document.getElementById("events-ui");
		if(!container){
			console.warn("Element not found, id: events-ui");
			return;
		}

		var script = document.getElementById("events-ui-script");
		var autoload = false;
		if(script){
			var temp = script.getAttribute("data-events-locations");
			if(temp){
				Events_UI.filterLocations = temp.split(",");
			}
			temp = script.getAttribute("data-events-startDate");
			if(temp){
				Events_UI.filterStartDate = new Date(temp);
			}else{
				Events_UI.filterStartDate = new Date();
			}
			temp = script.getAttribute("data-events-endDate");
			if(temp){
				Events_UI.filterEndDate = new Date(temp);
			}else if(Events_UI.filterStartDate){
				Events_UI.filterEndDate = new Date(Events_UI.filterStartDate.getTime()+2592000000);
			}
			temp = script.getAttribute("data-events-locale");
			if(temp){
				Events_UI.locale = temp;
			}
			temp = script.getAttribute("data-events-providerName");
			if(temp){
				Events_UI.filterProviderName = temp;
			}
			temp = script.getAttribute("data-events-collapsed");
			if(temp && temp == "true"){
				Events_UI.bodyCollapsed = true;
			}
			temp = script.getAttribute("data-events-autoload");
			if(temp && temp == "true"){
				autoload = true;
			}
		}

		var toolbar = document.createElement("div");
		toolbar.className = "events-ui-events_toolbar";

		var button = document.createElement("button");
		button.className = "events-ui-events_previous";
		button.onclick = Events_UI.previousEvents;
		toolbar.appendChild(button);

		Events_UI.elementCurrentPage = document.createElement("span");
		Events_UI.elementCurrentPage.className = "events-ui-current_page";
		toolbar.appendChild(Events_UI.elementCurrentPage);
		var divider = document.createElement("span");
		divider.className = "events-ui-page_number_divider ";
		divider.appendChild(document.createTextNode(" / "));
		toolbar.appendChild(divider);
		Events_UI.elementLastPage = document.createElement("span");
		Events_UI.elementLastPage.className = "events-ui-last_page";
		toolbar.appendChild(Events_UI.elementLastPage);

		button = document.createElement("button");
		button.className = "events-ui-events_next";
		button.onclick = Events_UI.nextEvents;
		toolbar.appendChild(button);

		container.appendChild(toolbar);

		Events_UI.elementEventList = document.createElement("div");
		Events_UI.elementEventList.id = "events-ui-events_list";
		container.appendChild(Events_UI.elementEventList);

		if(autoload){
			Events_UI.loadEvents();
		}
	},

	/**
	 * Reset paging options
	 *
	 * Note that you must call loadEvents() to actually update the list of visible events
	 */
	resetPaging : function() {
		Events_UI.currentPage = 1;
		Events_UI.lastPage = 0;
	},

	/**
	 * @param {Array[string]} keywords
	 */
	setKeywords : function(keywords) {
		Events_UI.filterKeywords = (keywords && keywords.length > 0 ? keywords : null);
	},

	/**
	 * @param {Array[string]} locations
	 */
	setLocations : function(locations) {
		Events_UI.filterLocations = (locations && locations.length > 0 ? locations : null);
	},

	/**
	 * @param {string} text
	 */
	setText : function(text) {
		Events_UI.filterText = text;
	},

	/**
	 * @param {string} provider
	 */
	setProviderName : function(provider) {
		Events_UI.filterProviderName = provider;
	},

	/**
	 * @param {Date} startDate
	 * @param {Date} endDate
	 */
	setDateInterval : function(startDate, endDate) {
		Events_UI.filterStartDate = startDate;
		Events_UI.filterEndDate = endDate;
	},

	/**
	 * load list of previous events
	 */
	previousEvents : function() {
		if(Events_UI.currentPage > 1){
			--Events_UI.currentPage;
			Events_UI.loadEvents();
		}
	},

	/**
	 * load list of next events
	 */
	nextEvents : function() {
		if(Events_UI.currentPage < Events_UI.lastPage){
			++Events_UI.currentPage;
			Events_UI.loadEvents();
		}
	},

	/**
	 * load event list based on currently set values
	 */
	loadEvents : function() {
		Events_API_Event.get(Events_UI.eventsLoaded, Events_UI.filterStartDate, Events_UI.filterEndDate, Events_UI.filterKeywords, Events_UI.filterLocations, Events_UI.currentPage, Events_UI.PAGE_SIZE, Events_UI.filterProviderName, Events_UI.sortEvents, Events_UI.filterText);
	},

	/**
	 * called after events have been loaded
	 *
	 * @param {JSON} data
	 */
	eventsLoaded : function(data) {
		Events_UI.elementEventList.innerHTML = "";

		if(!data || !data.meta.count || !data.data || data.data.length < 1){
			Events_UI.resetPaging();
			Events_UI.elementLastPage.textContent = 0;
			Events_UI.elementCurrentPage.textContent = 0;
			return;
		}else{
			Events_UI.lastPage = Math.ceil(data.meta.count / Events_UI.PAGE_SIZE);
			Events_UI.elementLastPage.textContent = Events_UI.lastPage;
			Events_UI.elementCurrentPage.textContent = Events_UI.currentPage;
		}

		for(var i=0;i<data.data.length;++i){
			var d = data.data[i];
			var dElement = document.createElement("div");
			dElement.className = "events-ui-data_container";

			var divider = document.createElement("hr");
			divider.className = "events-ui-data_container-divider";
			dElement.appendChild(divider);

			/* header */
			var header = document.createElement("div");
			header.className = "events-ui-data_header";
			var temp = d.name[Events_UI.locale];
			if(temp) {
				var name = document.createElement("div");
				name.className = "events-ui-data_header-name";
				name.appendChild(document.createTextNode(temp));
				header.appendChild(name);
			}
			var collapse = document.createElement("button");
			collapse.className = (Events_UI.bodyCollapsed ? "events-ui-data_header-expand" : "events-ui-data_header-collapse");
			collapse.addEventListener("click", function(){Events_UI.toggleCollapse(this)});
			header.appendChild(collapse);
			var date = document.createElement("div");
			date.className = "events-ui-data_header-date";
			var dateString = new Date(d.start_time).toLocaleString(Events_UI.locale+"-FI");
			if(d.end_time){
				dateString += " - " + new Date(d.end_time).toLocaleString(Events_UI.locale+"-FI");
			}
			date.appendChild(document.createTextNode(dateString));
			header.appendChild(date);
			temp = d.short_description[Events_UI.locale];
			if(temp){
				var shortDescription = document.createElement("div");
				shortDescription.className = "events-ui-data_header-short_description";
				shortDescription.appendChild(document.createTextNode(temp));
				header.appendChild(shortDescription);
			}
			dElement.appendChild(header);

			/* body */
			var body = document.createElement("div");
			body.className = "events-ui-data_body"+(Events_UI.bodyCollapsed ? " events-ui-data_body-collapsed" : " events-ui-data_body-expanded");
			if(d.images && d.images.length > 0){
				var image = document.createElement("div");
				image.style.backgroundImage = "url('"+d.images[0].url+"')";
				image.className = "events-ui-data_body-image";
				body.appendChild(image);
			}
			temp = d.description[Events_UI.locale];
			if(temp){
				var description = document.createElement("div");
				description.className = "events-ui-data_body-description";
				description.appendChild(document.createTextNode(temp));
				body.appendChild(description);
			}
			temp = d.location_extra_info[Events_UI.locale];
			if(temp){
				var locationExtraInfo = document.createElement("div");
				locationExtraInfo.className = "events-ui-data_body-location_extra_info";
				locationExtraInfo.appendChild(document.createTextNode(temp));
				body.appendChild(locationExtraInfo);
			}
			temp = d.info_url[Events_UI.locale];
			if(temp){
				var element = document.createElement("div");
				element.className = "events-ui-data_body-info_url";
				var infoUrl = document.createElement("a");
				infoUrl.setAttribute("href", temp);
				infoUrl.setAttribute("target", "_blank");
				infoUrl.appendChild(document.createTextNode(temp));
				element.appendChild(infoUrl);
				body.appendChild(element);
			}
			if(d.provider_name){
				var element = document.createElement("div");
				element.className = "events-ui-data_body-provider_name";
				if(d.provider_link){
					var link = document.createElement("a");
					link.setAttribute("href", d.provider_link);
					link.setAttribute("target", "_blank");
					link.appendChild(document.createTextNode(d.provider_name));
					element.appendChild(link);
				}else{
					element.appendChild(document.createTextNode(d.provider_name));
				}
				body.appendChild(element);
			}
			if(d.provider_email){
				var element = document.createElement("div");
				element.className = "events-ui-data_body-provider_email";
				var providerEmail = document.createElement("a");
				providerEmail.setAttribute("href", "mailto:"+d.provider_email);
				providerEmail.appendChild(document.createTextNode(d.provider_email));
				element.appendChild(providerEmail);
				body.appendChild(element);
			}
			dElement.appendChild(body);

			Events_UI.elementEventList.appendChild(dElement);
		}
	},

	/**
	 * Toggle collapsed/expanded state for an element
	 *
	 * @param {HTMLInputElement} collapse
	 */
	toggleCollapse : function(collapse) {
		var body = collapse.parentNode.parentNode.getElementsByClassName("events-ui-data_body")[0];
		if(body.className.indexOf("events-ui-data_body-collapsed") > 0) { // is collapsed
			body.className = body.className.replace("events-ui-data_body-collapsed", "")+" events-ui-data_body-expanded";
			collapse.className = collapse.className.replace("events-ui-data_header-expand", "")+" events-ui-data_header-collapse";
		}else{
			body.className = body.className.replace("events-ui-data_body-expanded", "")+" events-ui-data_body-collapsed";
			collapse.className = collapse.className.replace("events-ui-data_header-collapse", "")+" events-ui-data_header-expand";
		}
	}
};

jQuery(document).ready(function() {
	Events_UI.initialize();
});
