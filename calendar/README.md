Javascript / CSS implementation for Linked-Events / Satakunta Events API

# Directories / Files #

## css directory ##

Contains default CSS styles for the event calender and calendar filters.

You can use these styles or define your own.

All identifiers, classes, etc. used in JavaScript are defined in the example files.

Files:
- events-filters-ui.css, CSS styles for the filters / search parameter selectors
- events-ui.css, CSS styles for the event calendar (event list printed on the web page)

lib directory contains the default stylesheet and images required for JQuery (mainly for the datepicker component). If you are not planning to use the datapicker, these files are not needed.


## js directory ##

Contains JavaScript files for the event calender and calendar filters.

Files:
- events.js, JavaScript file for Event API. Requires: JQuery.
- events-ui.js, main file for event list functions. Requires: events.js.
- keywords.js, JavaScript file for Keyword API. Requires: JQuery.
- places.js, JavaScript file for Place API. Requires: JQuery.
- events-filters-ui.js, main file for event filter functions. Requires: events-ui.js, keywords.js, places.js, JQueryUI+stylesheet+translations file (if datepicker is used).

lib directory contains libraries required for JQuery (core and an example translation file). If you are not planning to use the datapicker or filters in general, the translation file is not required.


## root directory / example ##

index.html contains an example of how to add the event calendar to your web page.

In short, the usage is as follows. For the core event calendar (basic event list), include:

1) CSS stylesheet, either the default one (css/events-ui.css) or your own
2) JQuery library file (js/lib/jquery-3.3.1.min.js or other compatible version)
3) The API javascript files (js/events.js)
4) The core event list javascript file (js/events-ui.js). For the events-ui.js script element, you may include one or more of the following additional attributes, that control the script behavior:
	- id, with the value "events-ui-script", this MUST always be present if any other attributes are used, it is used by the javascript to locate the correct script element.
	- data-events-locale, for selecting text language of the events. Valid values depend on what languages are available in the events added to the Linked Events API. Usually, these are Swedish ("sv"), English ("en") and Finnish ("fi").
	- data-events-autoload, with value "true". This causes the listing to be automatically populated when the page loads. Otherwise you must call the Events_UI.loadEvents() function manually somewhere in your Javascript code or require users to manually press search button on the filter layout (if filters are used).
	- data-events-locations, a comma-separated list of strings that represent valid locations in the Linked Events API. The search will be by default targeted only to the listed locations.
	- data-events-startDate, ISO8601 string (e.g. 2018-12-17T01:00:00Z). By default, only events starting from this date are listed. If the attribute is not given, current date is used.
	- data-events-endDate, ISO8601 string (e.g. 2018-12-17T01:00:00Z). By default, only events ending before or at this date are listed. If the attribute is not given, a hardcoded date sometime in the distant future is used.
	- data-events-collapsed, with the value "true". If given AND "true", the event list is shown in "collapsed" mode. I.e. the user must manually open (click title/short description) the more detailed descriptions of the events.
	- data-events-providerName, with a string value. The "free text" provider name search term used as a filter.
5) And finally, add the <div id="events-ui"></div> element on your web page. Inside this element, the actual event list will be populated.


If you also want to show the data filters (selectors/search options) on your web page, include:

1) All the files/options as listed on the instructions for the core event list (above).
2) CSS stylesheet, either the default one (css/events-filters-ui.css) or your own
3) JQuery stylesheet (css/lib/jquery-ui-1.12.1.min.css). Strictly speaking, this is not required if you are not planning to use the datepicker.
4) JQuery library file (js/lib/jquery-ui-1.12.1.min.js or other compatible version). Strictly speaking, this is not required if you are not planning to use the datepicker.
5) If you are using the datepicker, you need to add a proper localization file (e.g. js/lib/i18n/datepicker-fi.js). Files for various languages are available on the JQuery's github page (https://github.com/jquery/jquery-ui/tree/master/ui/i18n). Note that the chosen language (e.g. "fi" for js/lib/i18n/datepicker-fi.js as in datepicker-XX.js, where XX is the language code) should match with the language code defined for the "data-events-locale" attribute of the main javascript file (js/events-filters-ui.js). See further below for more information.
6) The API javascript files (js/places.js, js/keywords.js). Strictly speaking, you only need places.js if you actually use places filter and keywords.js if you use keywords filter.
7) The core event filter javascript file (js/events-filters-ui.js). For the events-filters-ui.js script element, you may include one or more of the following additional attributes, that control the script behavior:
	- id, with the value "events-filters-ui-script", this MUST always be present if any other attributes are used, it is used by the javascript to locate the correct script element.
	- data-events-locale, for selecting text language of the events. Valid values depend on what languages are available in the events added to the Linked Events API. Usually, these are Swedish ("sv"), English ("en") and Finnish ("fi").
	- data-events-filters-date, with value "true". If given and the value is "true", the datapickers fow start and end date are shown.
	- data-events-startDate, ISO8601 string (e.g. 2018-12-17T01:00:00Z). By default, only events starting from this date are listed. If the attribute is not given, current date is used. This has no effect if data-events-filters-date is not given.
	- data-events-endDate, ISO8601 string (e.g. 2018-12-17T01:00:00Z). By default, only events ending before or at this date are listed. If the attribute is not given, a hardcoded date sometime in the distant future is used. This has no effect if data-events-filters-date is not given.
	- data-events-filters-text, with value "true". If given and the value is "true", the free-text search field is shown.
	- data-events-filters-places, with value "true". If given and the value is "true", the list of places (locations) is retrieved from the API and the location filter is shown.
	- data-events-filters-places-limit, with an integer value. This will override the hard-coded maximum amount of places to be retrieved from the API. This has no effect if data-events-filters-places is not given.
	- data-events-filters-keywords, with value "true". If given and the value is "true", the list of keywords is retrieved from the API and the keywords filter is shown.
	- data-events-filters-keywords-limit, with an integer value. This will override the hard-coded maximum amount of keywords to be retrieved from the API. This has no effect if data-events-filters-keywords is not given.
	- data-events-filters-providerName, with value "true". If given and the value is "true", show provider name free text search field.
8) And finally, add the <div id="events-filters-ui"></div> element on your web page. Inside this element, the actual event filters will be populated.


Note: The JavaScript code has been tested with JQuery 1.12.4 and 3.3.1, and with JQuery UI 1.12.1. It should work with newer version, and possibly with older versions.


# Known problems, issues and possible bugs #

The issues in the Satakunta Events API may have been fixed, so check the appropriate API documentation for changes. The known issues checked on December 19, 2018, are listed below:

- The selection of locations/keywords in filters works as an AND relation (not OR), producing empty result sets when multiple locations/keywords are selected. This is an issue in the Satakunta Events API.
- Pre-selecting locations or keywords with attribute parameters do not "pre-tick/select" these values in the filters. The end-user (probably) will never notice this...
- If no start date (data-events-startDate) is given, the current date is used (as the default start date)
- If no end date (data-events-endDate) is given, the (default) end date is hardcoded to be start date + 1 month. The Satakunta Events API gives data for the current day only if only start or end is given, which makes it impossible to select open-ended time intervals.
- The UI layout for provider name and text search could be more clear. Currently, it is difficult to figure out which input field is provider name and which is text search when both fields are available as search terms.
- There is no paging for keywords or locations on the filters, and the maximum number of choises is hardcoded in the javascript (and can be overridden by script attribute value). In general, there should not be excessive amount of keywords/locations available on the API, but if there are, the the extra choises are simply not listed.
- The JQueryUI CSS file included in the project contains the entire CSS stylesheet. Not all of this is required, and the size could be made smaller by including only the require parts (datepicker). Similarly, the JQuery library contains all components (only Ajax is required).

# Libraries #

JavaScript Libraries included in this project:
- JQuery, https://jquery.com
- JQueryUI, https://jqueryui.com
- JQueryUI/Datepicker translations from https://github.com/jquery/jquery-ui/tree/master/ui/i18n
- Licenses: https://github.com/jquery/jquery-ui/blob/master/LICENSE.txt (JQueryUI), https://jquery.org/license (JQuery)

