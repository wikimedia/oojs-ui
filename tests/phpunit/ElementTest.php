<?php

namespace OOUI\Tests;

use OOUI\Widget;

class ElementTest extends TestCase {

	public static function provideGetSerializedConfig() {
		return array(
			array(
				new Widget( array( 'infusable' => true ) ),
				'"_":"OO.ui.Widget"'
			),
			array(
				new \FooBarBaz\MockWidget( array( 'infusable' => true ) ),
				'"_":"foo.bar.baz.MockWidget"'
			),
		);
	}

	/**
	 * @covers Element::getSerializedConfig
	 * @dataProvider provideGetSerializedConfig
	 */
	public function testGetSerializedConfig( $widget, $expected ) {
		$this->assertContains( $expected, (string)$widget );
	}
}

