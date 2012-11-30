<?php

/**
 * TestingStaticFileView
 * @package MyQuickNet
 * @version 3.0
 * @copyright (c) 2012 MyQuickNet Development Group
 * @license http://opensource.org/licenses/MIT
 */

namespace com\googlecode\myquicknet\testing;

use com\googlecode\myquicknet\testing_config\TestingStaticFileViewConfig;

/**
 *
 */
class TestingStaticFileView extends TestingStaticFileViewConfig {

    /**
     *
     * @param array $config
     */
    public function __construct(array $config = array()) {
        parent::__construct($config);
    }

}

?>