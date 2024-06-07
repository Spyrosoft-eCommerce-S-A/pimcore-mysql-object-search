<?php
/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 * @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 * @license    http://www.pimcore.org/license     GPLv3 and PEL
 */

namespace DivanteLtd\AdvancedSearchBundle\Model\SavedSearch;

use Pimcore\Model;

/**
 * Class Listing
 * @package DivanteLtd\AdvancedSearchBundle\Model\SavedSearch
 */
class Listing extends Model\Listing\AbstractListing
{
    /**
     * Contains the results of the list. They are all an instance of SavedSearch
     *
     * @var array
     */
    public $savedSearches = [];

    /**
     * @param mixed $key
     * @return bool
     */
    public function isValidOrderKey(string $key): bool
    {
        return true;
    }

    /**
     * @param mixed $savedSearches
     *
     * @return $this
     */
    public function setSavedSearches($savedSearches)
    {
        $this->savedSearches = $savedSearches;

        return $this;
    }

    /**
     * @return array
     */
    public function getSavedSearches()
    {
        return $this->savedSearches;
    }
}
