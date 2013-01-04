<?php

/**
 * TestingStaticFileController
 * @package MyQuickNet
 * @version 4.5
 * @copyright (c) 2013 MyQuickNet Development Group
 * @license http://opensource.org/licenses/MIT
 */

namespace com\googlecode\myquicknet\testing;

use com\googlecode\myquicknet\testing_config\TestingStaticFileControllerConfig;

/**
 *
 */
class TestingStaticFileController extends TestingStaticFileControllerConfig
{
    /**
     *
     * @param array $config
     */
    public function __construct(array $config = array())
    {
        parent::__construct($config);
    }

}
