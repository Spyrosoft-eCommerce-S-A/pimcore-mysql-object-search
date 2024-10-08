# MySQL Object Search
[![Analysis Actions](https://github.com/DivanteLtd/pimcore-mysql-object-search/workflows/Analysis/badge.svg?branch=master)](https://github.com/DivanteLtd/pimcore-mysql-object-search/actions)
[![Tests Actions](https://github.com/DivanteLtd/pimcore-mysql-object-search/workflows/Tests/badge.svg?branch=master)](https://github.com/DivanteLtd/pimcore-mysql-object-search/actions)
[![Latest Stable Version](https://poser.pugx.org/divante-ltd/pimcore-mysql-object-search/v/stable)](https://packagist.org/packages/divante-ltd/pimcore-mysql-object-search)
[![Total Downloads](https://poser.pugx.org/divante-ltd/pimcore-mysql-object-search/downloads)](https://packagist.org/packages/divante-ltd/pimcore-mysql-object-search)
[![License](https://poser.pugx.org/divante-ltd/pimcore-mysql-object-search/license)](https://github.com/DivanteLtd/divante-ltd/pimcore-mysql-object-search/blob/master/LICENSE)

Similar to Pimcore's Advanced Object Search, but does not need Elasticsearch

**Table of Contents**
- [MySQL Object Search](#mysql-object-search)
	- [Compatibility](#compatibility)
	- [Installing/Getting started](#installinggetting-started)
	- [Requirements](#requirements)
	- [Configuration](#configuration)
	- [Testing](#testing)
	- [Contributing](#contributing)
	- [Licence](#licence)
	- [Standards & Code Quality](#standards--code-quality)

## Compatibility

This module is compatible with Pimcore 11 and higher.

## Installing/Getting started

```bash
composer require divante-ltd/pimcore-mysql-object-search
```

Enable the Bundle:
```bash
./bin/console pimcore:bundle:enable AdvancedSearchBundle
```

## Configuration

In Pimcore panel select Extensions click Install and Enable.

## Testing
Unit Tests:
```bash
PIMCORE_TEST_DB_DSN="mysql://username:password@localhost/pimcore_test" \
    vendor/bin/phpunit
```

Functional Tests:
```bash
PIMCORE_TEST_DB_DSN="mysql://username:password@localhost/pimcore_test" \
    vendor/bin/codecept run -c tests/codeception.dist.yml
```

## Contributing
If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Licence 
This source code is completely free and released under the 
[GNU General Public License v3.0](https://github.com/DivanteLtd/divante-ltd/pimcore-mysql-object-search/blob/master/LICENSE).
Respository forked from DivanteLtd/pimcore-mysql-object-search

## Standards & Code Quality
This module respects all Pimcore 5 code quality rules and our own PHPCS and PHPMD rulesets.

