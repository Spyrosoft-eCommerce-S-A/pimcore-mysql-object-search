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
 * @author     Michał Bolka <mbolka@divante.pl>
 */

namespace DivanteLtd\AdvancedSearchBundle\Filter\FieldDefinitionAdapter;

use Pimcore\Model\DataObject\Concrete;

/**
 * Class CalculatedValue
 *
 * @package Divante\AOSExtensionBundle\Filter\FieldDefinitionAdapter
 */
class CalculatedValue extends DefaultAdapter implements IFieldDefinitionAdapter
{
    use Operators\CharacterOperatorsTrait;

    /**
     * @param Concrete $object
     * @param bool     $ignoreInheritance
     *
     * @return string
     */
    protected function doGetIndexDataValue($object, $ignoreInheritance = false)
    {
        $name = $this->fieldDefinition->getName();
        $value = $object->getValueForFieldName($name);

        return (string) $value;
    }
}
