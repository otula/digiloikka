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
var Events_API_Place = {
	API_URI_GET : "https://www.satakuntaevents.fi/api/v2/place/?",
	PARAMETER_PAGE : "page",
	PARAMETER_PAGE_SIZE : "page_size",
	PARAMETER_SORT : "sort",
	PARAMETER_TEXT : "text",

	/**
	 * Create URI string, all parameters are optional
	 *
	 * @param {string} baseUri
	 * @param {integer} page current page number used in paging
	 * @param {integer} pageSize amount of result to include
	 * @param {string} sort sort criteria
	 * @param {string} text
	 * @return {string} the created URI
	 */
	createPlaceURI : function(baseUri, page, pageSize, sort, text){
		var uri = baseUri;
		var notFirst = false;

		if(page){
			uri += Events_API_Place.PARAMETER_PAGE+"="+page;
			notFirst = true;
		}

		if(pageSize){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Place.PARAMETER_PAGE_SIZE+"="+pageSize;
			notFirst = true;
		}

		if(sort){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Place.PARAMETER_SORT+"="+encodeURIComponent(sort);
			notFirst = true;
		}

		if(text){
			if(notFirst){
				uri += "&";
			}
			uri += Events_API_Place.PARAMETER_TEXT+"="+encodeURIComponent(text);
		}

		return uri;
	},

	/**
	 * Search places based on the given criteria
	 *
	 * @param {callback_function} callback called after function has completed with single value (json data) or with null on failure
	 * @param {integer} page current page number used in paging (optional)
	 * @param {integer} pageSize amount of result to include (optional)
	 * @param {string} sort sort criteria (optional)
	 * @param {string} text free-text search (optional)
	 */
	get : function(callback, page, pageSize, sort, text){
		jQuery.ajax({
			url : Events_API_Place.createPlaceURI(Events_API_Place.API_URI_GET, page, pageSize, sort, text),
			success : function(data){
				callback(data);
			},
			error : function(jqXHR, textStatus, errorThrown){
				console.log(textStatus+" "+errorThrown); //TODO REMOVE THIS
				callback(null);
			}
		});
	}
};
