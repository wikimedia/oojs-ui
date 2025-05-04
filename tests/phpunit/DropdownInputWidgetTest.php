<?php

namespace OOUI\Tests;

use OOUI\DropdownInputWidget;

/**
 * @covers \OOUI\DropdownInputWidget
 */
class DropdownInputWidgetTest extends TestCase {

	/**
	 * @dataProvider provideOptions
	 */
	public function testOptions( array $options, string $expectedHtml ) {
		$widget = new DropdownInputWidget( [ 'options' => $options ] );
		$html = (string)$widget;
		// Remove attributes we don't care about in this test
		$html = preg_replace( '/ (aria-\w*|class|tabindex)=\'[^\']*\'/', '', $html );
		$this->assertSame( $expectedHtml, $html );
	}

	public static function provideOptions() {
		yield 'empty' => [
			[],
			'<div><select></select></div>'
		];

		yield 'without label' => [
			[ [ 'data' => 'data1' ] ],
			"<div><select><option value='data1' selected='selected'>data1</option></select></div>"
		];

		yield 'with label' => [
			[ [ 'data' => 'data1', 'label' => 'label1' ] ],
			"<div><select><option value='data1' selected='selected'>label1</option></select></div>"
		];

		yield 'with group' => [
			[
				[ 'optgroup' => 'group1' ],
				[ 'data' => 'data1' ],
			],
			"<div><select><optgroup label='group1'>" .
				"<option value='data1' selected='selected'>data1</option></optgroup></select></div>"
		];

		yield 'group only' => [
			[ [ 'optgroup' => 'group1' ] ],
			"<div><select><optgroup label='group1'></optgroup></select></div>"
		];

		yield 'the label "0" is not empty' => [
			[ [ 'optgroup' => '0' ] ],
			"<div><select><optgroup label='0'></optgroup></select></div>"
		];

		yield 'empty group name' => [
			[ [ 'optgroup' => '' ] ],
			"<div><select><optgroup label=''></optgroup></select></div>"
		];
	}

}
