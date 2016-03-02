<?php

namespace OOUI\Tests;

use OOUI\Element;
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

	public static function provideConfigFromHtmlAttributes() {
		return [
			[
				[ 'disabled' => '', 'accesskey' => 'k' ],
				[ 'disabled' => true, 'accessKey' => 'k' ]
			],
			[
				[ 'disabled' => 'disabled' ],
				[ 'disabled' => true ]
			],
			[
				[ 'disabled' => false ],
				[ 'disabled' => false ]
			],
			[
				[ 'readonly' => '' ],
				[ 'readOnly' => true ]
			],
			[
				[ 'value' => 'Foo' ],
				[ 'value' => 'Foo' ]
			],
		];
	}

	/**
	 * @covers Element::configFromHtmlAttributes
	 * @dataProvider provideConfigFromHtmlAttributes
	 */
	public function testConfigFromHtmlAttributes( $attrs, $expected ) {
		$this->assertEquals( $expected, Element::configFromHtmlAttributes( $attrs ) );
	}
}

