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

namespace DivanteLtd\AdvancedSearchBundle\Model\SavedSearch\Listing;

use DivanteLtd\AdvancedSearchBundle\Model\SavedSearch;
use Pimcore\Model;

/**
 * Class Dao
 * @package DivanteLtd\AdvancedSearchBundle\Model\SavedSearch\Listing
 */
class Dao extends Model\Listing\Dao\AbstractDao
{
    /**
     * Loads a list of tags for the specifies parameters, returns an array of Element\Tag elements
     *
     * @return array
     */
    public function load(): array
    {
        $searchIds = $this->db->fetchFirstColumn(
            'SELECT id FROM ' . $this->db->quoteIdentifier(SavedSearch\Dao::TABLE_NAME) . ' ' .
            $this->getCondition() . $this->getOrder() . $this->getOffsetLimit(),
            $this->model->getConditionVariables()
        );

        $searches = [];
        foreach ($searchIds as $id) {
            if ($savedSearch = SavedSearch::getById($id)) {
                $searches[] = $savedSearch;
            }
        }

        $this->model->setSavedSearches($searches);

        return $searches;
    }

    /**
     * @return mixed
     */
    public function loadIdList()
    {
        return $this->db->fetchCol(
            'SELECT id FROM ' . $this->db->quoteIdentifier(SavedSearch\Dao::TABLE_NAME) . ' ' .
            $this->getCondition() . $this->getGroupBy() . $this->getOrder() . $this->getOffsetLimit(),
            $this->model->getConditionVariables()
        );
    }

    /**
     * @return int
     */
    public function getTotalCount(): int
    {
        try {
            $amount = (int) $this->db->fetchOne(
                'SELECT COUNT(*) as amount FROM ' . $this->db->quoteIdentifier(SavedSearch\Dao::TABLE_NAME) . ' ' .
                $this->getCondition(),
                $this->model->getConditionVariables()
            );
        } catch (\Exception $e) {
            return 0;
        }

        return $amount;
    }
}
