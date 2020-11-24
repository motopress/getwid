<?php

namespace Getwid;

class VersionControl {

    /** @var string */
    protected $pluginVersion = '';

    /** @var string */
    protected $dbVersion = '';

    /** @var bool */
    protected $needUpgrade = false;

    public function __construct(){

		$settings = getwid()->settings();

        $this->pluginVersion = $settings->getVersion();

        $this->checkVersion();
        $this->addActions();
    }

    protected function checkVersion()
    {
        $this->dbVersion = $this->getCurrentDatabaseVersion();

        if (version_compare($this->pluginVersion, $this->dbVersion, '>')) {
            $this->needUpgrade = true;
        }
    }

    protected function addActions()
    {
        if ($this->needUpgrade) {
            add_action('init', [$this, 'upgrade']);
        }
    }

    public function upgrade()
    {
        // Nothing to do at the moment
        $this->afterUpgrade();
    }

    protected function afterUpgrade()
    {
        $this->setCurrentDatabaseVersion($this->pluginVersion);

        if (version_compare($this->pluginVersion, $this->dbVersion, '!=')) {
            $this->addVersionToHistory($this->pluginVersion);
        }
    }

    protected function getCurrentDatabaseVersion()
    {
        return get_option('getwid_db_version', '0.0.0');
    }

    protected function setCurrentDatabaseVersion($version)
    {
        update_option('getwid_db_version', $version);
    }

    protected function addVersionToHistory($version)
    {
        $versionHistory = get_option('getwid_db_version_history', []);

        if (!in_array($version, $versionHistory)) {
            $versionHistory[] = $version;
            update_option('getwid_db_version_history', $versionHistory);
        }
    }
}
