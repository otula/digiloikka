<?php
/*
Plugin Name: Event Calendar
Plugin URI: www.example.org
Description: A short description
Version: 0.0.1-01112018
Author: TUT Pori
Author URI: www.tut.fi
License: Apache 2.0
License URI: https://apache.org/licenses/LICENSE-2.0
*/

/* based on: https://medium.freecodecamp.org/how-to-create-a-wordpress-plugin-for-your-web-app-5c31733f3a9d

Usage: add the placeholder div elements anywhere in wordpress:

<div id="events-filters-ui"><!-- populated dynamically --></div>
<div id="events-ui"><!-- populated dynamically --></div>

*/

/*
 * Plugin constants
 */
if(!defined('CALENDAR_URL'))
	define('CALENDAR_URL', plugin_dir_url(__FILE__));
if(!defined('CALENDAR_PATH'))
	define('CALENDAR_PATH', plugin_dir_path(__FILE__));

/**
 * main class
 */
class EventCalendar {
  private $option_name = 'eventcalendar_data';
  private $_nonce = 'eventcalendar_admin';

  /**
   * constructor
   */
  public function __construct(){
    add_action('admin_menu', array($this, 'addAdminMenu'));
    add_action('wp_ajax_store_admin_data', array($this, 'storeAdminData'));
		add_filter('script_loader_tag', array($this, 'filterScripts'), 10, 3 );
		add_action('init', array($this, 'addScripts'));
		add_action('admin_enqueue_scripts', array($this, 'addAdminScripts'));
  }

  /**
   * create admin menu
   */
  public function addAdminMenu() {
    add_menu_page(
  	   __( 'EventCalendar', 'eventcalendar' ),
  	   __( 'EventCalendar', 'eventcalendar' ),
  	   'manage_options',
  	   'eventcalendar',
  	   array($this, 'adminLayout'),
  	   ''
    );
  }

  /**
   * Create admin layout
   */
  public function adminLayout(){
    $data = $this->getData();
?>
    <div class="wrap">
      <h3><?php _e('Event Calendar API Settings', 'eventcalendar'); ?></h3>
      <hr>
      <form id="eventcalendar-admin-form">
        <table class="form-table">
          <tbody>
						<!-- events -->
            <tr>
              <td scope="row">
                <label><?php _e('Location(s)', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_locations"
                  id="eventcalendar_locations"
									type="text"
                  class="regular-text"
									placeholder="<?php _e('Comma-separated list of locations', 'eventcalendar'); ?>"
                  value="<?php echo (isset($data['eventcalendar_locations'])) ? $data['eventcalendar_locations'] : ''; ?>"/>
              </td>
            </tr>
            <tr>
              <td scope="row">
                <label><?php _e('Locale', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_locale"
                  id="eventcalendar_locale"
									type="text"
                  class="regular-text"
									placeholder="<?php _e('Name of locale, e.g. fi', 'eventcalendar'); ?>"
                  value="<?php echo (isset($data['eventcalendar_locale'])) ? $data['eventcalendar_locale'] : ''; ?>"/>
              </td>
            </tr>
						<tr>
              <td scope="row">
                <label><?php _e('Start date', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_start_date"
                  id="eventcalendar_start_date"
									type="text"
                  class="regular-text"
									placeholder="<?php _e('Add in ISO8601, e.g. 2018-12-17T01:00:00Z, clear to remove.', 'eventcalendar'); ?>"
                  value="<?php echo (isset($data['eventcalendar_start_date'])) ? $data['eventcalendar_start_date'] : ''; ?>"/>
              </td>
            </tr>
						<tr>
              <td scope="row">
                <label><?php _e('End date', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_end_date"
                  id="eventcalendar_end_date"
									type="text"
                  class="regular-text"
									placeholder="<?php _e('Add in ISO8601, e.g. 2018-12-17T01:00:00Z, clear to remove.', 'eventcalendar'); ?>"
                  value="<?php echo (isset($data['eventcalendar_end_date'])) ? $data['eventcalendar_end_date'] : ''; ?>"/>
              </td>
            </tr>
						<tr>
							<td scope="row">
								<label><?php _e('Provider name', 'eventcalendar'); ?></label>
							</td>
							<td>
								<input name="eventcalendar_provider_name"
									id="eventcalendar_provider_name"
									type="text"
									class="regular-text"
									placeholder="<?php _e('Name of event provider or organizer.', 'eventcalendar'); ?>"
									value="<?php echo (isset($data['eventcalendar_provider_name'])) ? $data['eventcalendar_provider_name'] : ''; ?>"/>
							</td>
						</tr>
            <tr>
              <td scope="row">
                <label><?php _e('Collapsed', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_collapsed"
                  id="eventcalendar_collapsed"
                  type="checkbox"
                  <?php echo (isset($data['eventcalendar_collapsed'])) ? 'checked' : ''; ?>/>
              </td>
            </tr>
						<!-- events filters -->
						<tr>
              <td scope="row">
                <label><?php _e('Show Text Filter', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_filters_text"
                  id="eventcalendar_filters_text"
                  type="checkbox"
                  <?php echo (isset($data['eventcalendar_filters_text'])) ? 'checked' : ''; ?>/>
              </td>
            </tr>
						<tr>
							<td scope="row">
								<label><?php _e('Show Provider Name Filter', 'eventcalendar'); ?></label>
							</td>
							<td>
								<input name="eventcalendar_filters_provider_name"
									id="eventcalendar_filters_provider_name"
									type="checkbox"
									<?php echo (isset($data['eventcalendar_filters_provider_name'])) ? 'checked' : ''; ?>/>
							</td>
						</tr>
						<tr>
              <td scope="row">
                <label><?php _e('Show Location Filter', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_filters_places"
                  id="eventcalendar_filters_places"
									type="checkbox"
                  <?php echo (isset($data['eventcalendar_filters_places'])) ? 'checked' : ''; ?>/>
              </td>
            </tr>
						<tr>
              <td scope="row">
                <label><?php _e('Show Keyword Filter', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_filters_keywords"
                  id="eventcalendar_filters_keywords"
									type="checkbox"
                  <?php echo (isset($data['eventcalendar_filters_keywords'])) ? 'checked' : ''; ?>/>
              </td>
            </tr>
						<tr>
              <td scope="row">
                <label><?php _e('Show Date Filter', 'eventcalendar'); ?></label>
              </td>
              <td>
                <input name="eventcalendar_filters_date"
                  id="eventcalendar_filters_date"
                  type="checkbox"
                  <?php echo (isset($data['eventcalendar_filters_date'])) ? 'checked' : ''; ?>/>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="button button-primary" id="eventcalendar-admin-save" type="submit"><?php _e( 'Save', 'eventcalendar' ); ?></button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
	<?php
  }

  /**
  * Returns the saved options data as an array
  *
  * @return array
  */
  private function getData() {
    return get_option($this->option_name, array());
  }

  /**
   * add admin scripts
   */
  public function addAdminScripts(){
		wp_enqueue_script('jquery');
    wp_enqueue_script('eventcalendar-plugin-admin', CALENDAR_URL. 'assets/js/admin.js', array('jquery'), NULL, false);
    $admin_options = array(
      'ajax_url' => admin_url('admin-ajax.php'),
      '_nonce'   => wp_create_nonce($this->_nonce),
    );
    wp_localize_script('eventcalendar-plugin-admin', 'eventcalendar_exchanger', $admin_options);
  }

	/**
   * add scripts
   */
  public function addScripts(){
		wp_enqueue_style('eventcalendar-plugin-events-ui-styles', CALENDAR_URL. 'assets/calendar/css/events-ui.css');
		wp_enqueue_style('eventcalendar-plugin-events-filters-ui-styles', CALENDAR_URL. 'assets/calendar/css/events-filters-ui.css');
		wp_enqueue_style('eventcalendar-plugin-events-jquery-ui-styles', CALENDAR_URL. 'assets/calendar/css/lib/jquery-ui-1.12.1.min.css');

		wp_enqueue_script('jquery');
		wp_enqueue_script('jquery-ui-datepicker');

		$deps = array('eventcalendar-plugin-events-ui', 'jquery-ui-datepicker');
		foreach(glob(CALENDAR_PATH . '/assets/calendar/js/lib/i18n/datepicker*.js' ) as $file) { // include all localization files. We could also directly load the files required for the (set) locale from GitHub repository of JQuery
			$filename = substr($file, strrpos($file, '/') + 1);
			$handle = 'eventcalendar-plugin-events-filters-ui-locale-'.$filename;
			array_push($deps, $handle);
		  wp_enqueue_script($handle, CALENDAR_URL.'assets/calendar/js/lib/i18n/'.$filename);
		}

		wp_enqueue_script('eventcalendar-plugin-events-events', CALENDAR_URL. 'assets/calendar/js/events.js', array('jquery'), NULL, false);
		wp_enqueue_script('eventcalendar-plugin-events-places', CALENDAR_URL. 'assets/calendar/js/places.js', array('jquery'), NULL, false);
		wp_enqueue_script('eventcalendar-plugin-events-keywords', CALENDAR_URL. 'assets/calendar/js/keywords.js', array('jquery'), NULL, false);

		wp_enqueue_script('eventcalendar-plugin-events-ui', CALENDAR_URL. 'assets/calendar/js/events-ui.js', array('eventcalendar-plugin-events-events', 'eventcalendar-plugin-events-places', 'eventcalendar-plugin-events-keywords'), NULL, false);

		wp_enqueue_script('eventcalendar-plugin-events-filters-ui', CALENDAR_URL. 'assets/calendar/js/events-filters-ui.js', $deps, NULL, false);
  }

	/**
	 * @param {string} tag
	 * @param {string} handle
	 * @param {string} src
	 */
	public function filterScripts($tag, $handle, $src){
		if('eventcalendar-plugin-events-ui' === $handle) {
			$data = $this->getData();
			$locations = (isset($data['eventcalendar_locations'])) ? ' data-events-locations="'.$data['eventcalendar_locations'].'"' : '';
			$locale = ((isset($data['eventcalendar_locale'])) ? ' data-events-locale="'.$data['eventcalendar_locale'].'"' : '');
			$providerName = ((isset($data['eventcalendar_provider_name'])) ? ' data-events-providerName="'.$data['eventcalendar_provider_name'].'"' : '');
			$startDate = ((isset($data['eventcalendar_start_date'])) ? ' data-events-startDate="'.$data['eventcalendar_start_date'].'"' : '');
			$endDate = ((isset($data['eventcalendar_end_date'])) ? ' data-events-endDate="'.$data['eventcalendar_end_date'].'"' : '');
			$collapsed = ((isset($data['eventcalendar_collapsed'])) ? ' data-events-collapsed="true"' : '');

			$tag = '<script id="events-ui-script" data-events-autoload="true" '.$locations.$startDate.$endDate.$locale.$providerName.$collapsed.' src="'.esc_url($src).'"></script>';
    }elseif('eventcalendar-plugin-events-filters-ui' === $handle){
			$data = $this->getData();
			$locale = ((isset($data['eventcalendar_locale'])) ? ' data-events-locale="'.$data['eventcalendar_locale'].'"' : '');
			$filtersText = ((isset($data['eventcalendar_filters_text'])) ? ' data-events-filters-text="true"' : '');
			$filtersPlaces = ((isset($data['eventcalendar_filters_places'])) ? ' data-events-filters-places="true"' : '');
			$filtersKeywords = ((isset($data['eventcalendar_filters_keywords'])) ? ' data-events-filters-keywords="true"' : '');
			$filtersDate = ((isset($data['eventcalendar_filters_date'])) ? ' data-events-filters-date="true"' : '');
			$filtersProviderName = ((isset($data['eventcalendar_filters_provider_name'])) ? ' data-events-filters-providerName="true"' : '');
			$startDate = ((isset($data['eventcalendar_start_date'])) ? ' data-events-startDate="'.$data['eventcalendar_start_date'].'"' : '');
			$endDate = ((isset($data['eventcalendar_end_date'])) ? ' data-events-endDate="'.$data['eventcalendar_end_date'].'"' : '');

			$tag = '<script id="events-filters-ui-script" '.$locale.$startDate.$endDate.$filtersText.$filtersPlaces.$filtersKeywords.$filtersProviderName.$filtersDate.' src="'.esc_url($src).'"></script>';
		}
		return $tag;
	}

  /**
   * store admin data
   */
  public function storeAdminData(){
    if (wp_verify_nonce($_POST['security'], $this->_nonce ) === false)
      die('Invalid Request!');

    $data = array();

    foreach ($_POST as $field=>$value) {
      if (substr($field, 0, 14) !== "eventcalendar_" || empty($value))
        continue;

      $data[$field] = htmlspecialchars($value);
    }

    update_option($this->option_name, $data);
    echo __('Saved!', 'feedier');
    die();
  }

} // EventCalendar

new EventCalendar();
