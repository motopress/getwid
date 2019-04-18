<?php

namespace Getwid;

class WritingSettings
{
    public function __construct($settings)
    {
		$this->version = $settings->getVersion();
		$this->prefix  = $settings->getPrefix();        
        $this->addActions();
    }

    protected function addActions()
    {
        add_action('admin_init', [$this, 'registerGroups']);
        add_action('admin_init', [$this, 'registerFields']);
    }

    public function registerGroups()
    {
        $echoNothing = function () {};

        add_settings_section('getwid', __('Getwid', 'getwid'), $echoNothing, 'writing');
    }

    public function registerFields()
    {
        //Section Content Width
        add_settings_field('getwid_section_content_width', __('Section Content Width', 'getwid'),
            [$this, 'renderSectionContentWidth'], 'writing', 'getwid');
        register_setting('writing', 'getwid_section_content_width', ['type' => 'number', 'default' => '']);


        //Instagram Access Token
        add_settings_field('getwid_instagram_token', __('Instagram Access Token', 'getwid'),
            [$this, 'renderInstagramToken'], 'writing', 'getwid');
        register_setting('writing', 'getwid_instagram_token', ['type' => 'number', 'default' => '']);
        

        //Google API Key
        add_settings_field('getwid_google_api_key', __('Google API Key', 'getwid'),
            [$this, 'renderGoogleApiKey'], 'writing', 'getwid');
        register_setting('writing', 'getwid_google_api_key', ['type' => 'number', 'default' => '']);        
    }

    public function renderSectionContentWidth()
    {
        $field_val = get_option('getwid_section_content_width', '');

        echo '<input type="number" id="getwid_section_content_width" name="getwid_section_content_width" type="text" value="' . esc_attr($field_val) . '" />';
        echo ' ', _x('px', 'pixels', 'getwid');
		echo '<p class="description">' . __('Default width of content area in the Section block. Leave empty to use the width set in your theme.', 'pixels', 'getwid') . '</p>';
    }

    public function renderInstagramToken()
    {
 /*        if (current_user_can('manage_options')){

        } */

        


        if (isset($_GET['token'])) { 
            update_option('getwid_instagram_token', $_GET['token']);
            delete_transient( 'getwid_instagram_response_data' ); //Delete cache data
        ?>
            <div id="message" class="updated">
                <p><strong><?php 
                    _e('Instagram Access Token Updated.');                  
                ?></strong></p>
            </div>
        <?php
        }

        if (isset($_GET['error'])) { ?>
            <div id="message" class="notice notice-error">
                <p><strong><?php 
                    if ($_GET['error'] == 'OAuthException'){
                        _e('The user denied request', 'getwid');
                    } else {
                        _e('Access denied', 'getwid');
                    }
                ?></strong></p>
            </div>
        <?php }

        $field_val = get_option('getwid_instagram_token', '');
        echo '<input type="text" id="getwid_instagram_token" name="getwid_instagram_token" type="text" size="50" value="' . esc_attr($field_val) . '" />';
		echo '<p class="description">' . __('Enter Instagram Token', 'getwid') . '</p>';
    }    

    public function renderGoogleApiKey()
    {
        $field_val = get_option('getwid_google_api_key', '');

        echo '<input type="text" id="getwid_google_api_key" name="getwid_google_api_key" type="text" size="50" value="' . esc_attr($field_val) . '" />';
		echo '<p class="description">' . __('Enter Google API Key', 'getwid') . '</p>';
    }
}
