<?php

namespace OOUI\Tests;

use OOUI\Widget;

class ElementTest extends TestCase {

	public static function provideGetSerializedConfig() {
		return [
			[
				new Widget( [ 'infusable' => true ] ),
				'"_":"OO.ui.Widget"'
			],
			[
				new \FooBarBaz\MockWidget( [ 'infusable' => true ] ),
				'"_":"foo.bar.baz.MockWidget"'
			],
		];
	}

	/**
	 * @covers Element::getSerializedConfig
	 * @dataProvider provideGetSerializedConfig
	 */
	public function testGetSerializedConfig( $widget, $expected ) {
		$this->assertContains( $expected, (string)$widget );
	}
}

