<?php

namespace OOUI\Tests;

use OOUI\Widget;

class ElementTest extends TestCase {

	public static function provideGetSerializedConfig() {
		return array(
			array(
				new Widget( array( 'infusable' => true ) ),
				'"_":"Widget"'
			),
			array(
				new \FooBarBaz\MockWidget( array( 'infusable' => true ) ),
				'"_":"FooBarBaz\\\\MockWidget"'
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

