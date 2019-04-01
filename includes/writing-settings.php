<?php

namespace Getwid;

class WritingSettings
{
    public function __construct()
    {
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
        add_settings_field('getwid_section_content_width', __('Section Content Width', 'getwid'),
            [$this, 'renderSectionContentWidth'], 'writing', 'getwid');

        register_setting('writing', 'getwid_section_content_width', ['type' => 'number', 'default' => '']);
    }

    public function renderSectionContentWidth()
    {
        $contentWidth = get_option('getwid_section_content_width', '');

        echo '<input type="number" id="getwid_section_content_width" name="getwid_section_content_width" type="text" value="' . esc_attr($contentWidth) . '" />';
        echo ' ', _x('px', 'pixels', 'getwid');
		echo '<p class="description">' . __('Default width of content area in the Section block. Leave empty to use the width set in your theme.', 'pixels', 'getwid') . '</p>';
    }
}
