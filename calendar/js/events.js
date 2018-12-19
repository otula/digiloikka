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
 * Event Calendar API functions
 *
 * See <a href="https://www.satakuntaevents.fi/api/v2/">Satakunta Events API v2</a> documentation.
 */
var Events_API_Event = {
	API_URI_GET : "https://www.satakuntaevents.fi/api/v2/event/?",
	PARAMETER_END : "end",
	PARAMETER_KEYWORD : "keyword",
	PARAMETER_LOCATION : "location",
	PARAMETER_PAGE : "page",
	PARAMETER_PAGE_SIZE : "page_size",
	PARAMETER_PROVIDER_NAME : "provider_name",
	PARAMETER_SORT : "sort",
	PARAMETER_START : "start",
	PARAMETER_TEXT : "text",

	/**
	 * Create URI string, all parameters are optional
	 *
	 * @param {string} baseUri
	 * @param {Date} start
	 * @param {Date} end
	 * @param {Array[string]} keywords
	 * @param {Array[string]} locations
	 * @param {integer} page current page number used in paging
	 * @param {integer} pageSize amount of result to include
	 * @param {string} providerName provider / organizer name
	 * @param {string} sort sort criteria
	 * @param {string} text
	 * @return {string} the created URI
	 */
	createEventURI : function(baseUri, start, end, keywords, locations, page, pageSize, providerName, sort, text){
		var uri = baseUri;
		var notFirst = false;

		if(start){
			uri += Events_API_Event.PARAMETER_START+"="+encodeURIComponent(start.toISOString());
			notFirst = true;
		}

		if(end){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_END+"="+encodeURIComponent(end.toISOString());
			notFirst = true;
		}

		if(keywords && keywords.length > 0){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_KEYWORD+"="+encodeURIComponent(keywords[0]);
			for(var i=1;i<keywords.length;++i){
				uri += ","+encodeURIComponent(keywords[i]);
			}
			notFirst = true;
		}

		if(locations && locations.length > 0){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_LOCATION+"="+encodeURIComponent(locations[0]);
			for(var i=1;i<locations.length;++i){
				uri += ","+encodeURIComponent(locations[i]);
			}
			notFirst = true;
		}

		if(page){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_PAGE+"="+page;
			notFirst = true;
		}

		if(pageSize){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_PAGE_SIZE+"="+pageSize;
			notFirst = true;
		}

		if(providerName){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_PROVIDER_NAME+"="+providerName;
			notFirst = true;
		}

		if(sort){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_SORT+"="+encodeURIComponent(sort);
			notFirst = true;
		}

		if(text){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Event.PARAMETER_TEXT+"="+encodeURIComponent(text);
		}

		return uri;
	},

	/**
	 * Search events based on the given criteria
	 *
	 * @param {callback_function} callback called after function has completed with single value (json data) or with null on failure
	 * @param {Date} start date interval start (optional)
	 * @param {Date} end date interval end (optional)
	 * @param {Array[string]} keywords keyword used as filter (optional)
	 * @param {Array[string]} locations name or id of event location (optional). Despite the name, this is actually a list of names/identifiers retrieved from "place" method, e.g. "place ids"
	 * @param {integer} page current page number used in paging (optional)
	 * @param {integer} pageSize amount of result to include (optional)
	 * @param {string} providerName provider / organizer name
	 * @param {string} sort sort criteria
	 * @param {string} text free-text search (optional)
	 */
	get : function(callback, start, end, keywords, locations, page, pageSize, providerName, sort, text){
		jQuery.ajax({
			url : Events_API_Event.createEventURI(Events_API_Event.API_URI_GET, start, end, keywords, locations, page, pageSize, providerName, sort, text),
			success : function(data){
				callback(data);
			},
			error : function(jqXHR, textStatus, errorThrown){
				callback(null);
			}
		});
	}
};
