<?php

declare(strict_types=1);

namespace DivanteLtd\AdvancedSearchBundle;

use DivanteLtd\AdvancedSearchBundle\Model\SavedSearch\Dao;
use Doctrine\DBAL\Migrations\Version;
use Doctrine\DBAL\Schema\Schema;
use Pimcore\Config;
use Pimcore\Extension\Bundle\Installer\AbstractInstaller;
use Pimcore\Extension\Bundle\Installer\InstallerInterface;

/**
 * Class Installer
 * @package DivanteLtd\AdvancedSearchBundle
 */
class Installer extends AbstractInstaller implements InstallerInterface
{
    const QUEUE_TABLE_NAME = 'bundle_advancedsearch_update_queue';

    public function __construct($bundle = 'advancedsearch')
    {
        parent::__construct();
    }

    /**
     * @param Schema $schema
     * @param Version $version
     * @return bool
     */
    public function install(): void
    {
        $this->installDatabase();

        //return $this->isInstalled();
    }

    /**
     * @param Schema $schema
     * @param Version $version
     * @return void
     */
    public function uninstall(): void
    {
    }

    /**
     * @return void
     */
    private function installDatabase(): void
    {
        //create tables
        \Pimcore\Db::get()->query(
            'CREATE TABLE IF NOT EXISTS `' . self::QUEUE_TABLE_NAME . "` (
                  `o_id` bigint(10) NOT NULL DEFAULT '0',
                  `classId` int(11) DEFAULT NULL,
                  `in_queue` tinyint(1) DEFAULT NULL,
                  `worker_timestamp` int(20) DEFAULT NULL,
                  `worker_id` varchar(20) DEFAULT NULL,
                  PRIMARY KEY (`o_id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;"
        );

        \Pimcore\Db::get()->query(
            'CREATE TABLE IF NOT EXISTS `' . Dao::TABLE_NAME . '` (
                  `id` bigint(20) NOT NULL AUTO_INCREMENT,
                  `name` varchar(255) DEFAULT NULL,
                  `description` varchar(255) DEFAULT NULL,
                  `category` varchar(255) DEFAULT NULL,
                  `ownerId` int(20) DEFAULT NULL,
                  `config` text CHARACTER SET latin1,
                  `sharedUserIds` varchar(1000) DEFAULT NULL,
                  `shortCutUserIds` text CHARACTER SET latin1,
                  PRIMARY KEY (`id`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8;'
        );

        //insert permission
        $key = 'bundle_advancedsearch_search';
        $permission = new \Pimcore\Model\User\Permission\Definition();
        $permission->setKey($key);

        $res = new \Pimcore\Model\User\Permission\Definition\Dao();
        $res->configure(\Pimcore\Db::get());
        $res->setModel($permission);
        $res->save();
    }

    /**
     * @return bool
     */
    public function isInstalled(): bool
    {
        $result = null;

        try {
            if (Config::getSystemConfiguration()) {
                $result = \Pimcore\Db::get()->fetchAllAssociative("SHOW TABLES LIKE '" . self::QUEUE_TABLE_NAME . "';");
            }
        } catch (\Exception $e) {
            return false;
        }

        return !empty($result);
    }

    public function canBeInstalled(): bool
    {
        return true;
    }

    public function canBeUninstalled(): bool
    {
        return false;
    }
}
