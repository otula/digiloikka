This is a wordpress plugin adaptation of the event Javascript event calendar for Linked Events API / Satakunta Events API.

The adaptation contains a single PHP file (event-calendar.php), which constructs the admin page / settings page for wordpress and implements the injection of the JavaScript and CSS files into a web page. The implementation uses the default JQuery and JQuery UI bundled with Wordpress.

# Files and Directories #

The assets directory contains the actual JavaScript and CSS files:
- js/admin.js constains functions for the admin page.

The assets/calendar directory contains the Javascript/CSS files from the Event Calendar, see the calendar documentation for more information (or the file comments):
- Note: lib/i18n/datepicker-fi.js only contains Finnish localization of the JQuery UI datepicker. If you are planning to use the datepicker in some other language, you need to download an appropriate localization file from the JQuery GitHub (https://github.com/jquery/jquery-ui/tree/master/ui/i18n) and include it in the i18n directory. All files in the i18n directory will be automatically included by the PHP file.
- The JQuery library files have been removed from the calendar directory as these files are by default already bundled with Wordpress.

NOTE: The provided CSS files should work with default Wordpress themes. Nevertheless, as the themes do override certain CSS definitions, depending on your use case and Wordpress installation, you may need to modify the provided CSS files.


# Usage #

Copy the event calendar directory to your Wordpress plugins directory as you would include any other plugin.

Use the admin page to select what filters you wish to be visible on the web page.

Edit the HTML code of the page where you want to add the calendar in Wordpress and add the following div elements to any reasonable place in the HTML source code:

<div id="events-filters-ui"></div>
<div id="events-ui"></div>

The first line will designate the place where the filters will be populated and the second one will be populated by the actual event list. You can also only add the second line if you prefer not to show any filters.

The lines do not need to be one after another, and can be in any order, but only a single "events-filters-ui" and a single "events-ui" can be located on a single web page.

# Known problems, issues and possible bugs #

- There is no datepicker on the admin page. The user must manually add the date in ISO8601 format.
- The JQueryUI CSS file included in the project contains the entire CSS stylesheet. Not all of this is required, and the size could be made smaller by including only the require parts (datepicker).

# Libraries #

JavaScript Libraries included in this project:
- JQuery, https://jquery.com
- JQueryUI/Datepicker translations from https://github.com/jquery/jquery-ui/tree/master/ui/i18n
- Licenses: https://github.com/jquery/jquery-ui/blob/master/LICENSE.txt (JQueryUI)

