<?php

namespace OOUI\Tests;

use OOUI\MediaWikiTheme;
use PHPUnit_Framework_TestCase;
use OOUI\Theme;

class TestCase extends PHPUnit_Framework_TestCase {
	/**
	 * Subclasses can override
	 * @return Theme
	 */
	protected function getTheme() {
		return new MediaWikiTheme();
	}

	public function setUp() {
		parent::setUp();
		Theme::setSingleton( $this->getTheme() );
	}

	public function tearDown() {
		Theme::setSingleton( null );
		parent::tearDown();
	}
}
