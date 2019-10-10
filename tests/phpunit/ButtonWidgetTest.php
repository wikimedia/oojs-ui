<?php

namespace OOUI\Tests;

use OOUI\ButtonWidget;

class ButtonWidgetTest extends TestCase {

	/**
	 * @covers \OOUI\ButtonWidget::getNoFollow
	 * @dataProvider provideGetNoFollow
	 * @param array $config
	 * @param bool $expectedNoFollow
	 * @param array $expectedRel
	 */
	public function testGetNoFollow( array $config, $expectedNoFollow, array $expectedRel ) {
		$button = new ButtonWidget( $config );

		$this->assertEquals( $expectedNoFollow, $button->getNoFollow() );
		$this->assertEquals( $expectedRel, $button->getRel() );
	}

	public static function provideGetNoFollow() {
		return [
			'None specified' => [
				[], true, [ 'nofollow' ]
			],
			'NoFollow disabled' => [
				[ 'noFollow' => false ], false, []
			],
			'NoFollow explicitly enabled' => [
				[ 'noFollow' => true ], true, [ 'nofollow' ]
			]
		];
	}

	/**
	 * @covers \OOUI\ButtonWidget::setNoFollow
	 * @dataProvider provideSetNoFollow
	 * @param bool $noFollow
	 * @param bool $expectedNoFollow
	 * @param array $expectedRel
	 */
	public function testSetNoFollow( $noFollow, $expectedNoFollow, array $expectedRel ) {
		$button = new ButtonWidget();
		$button->setNoFollow( $noFollow );

		$this->assertEquals( $expectedNoFollow, $button->getNoFollow() );
		$this->assertEquals( $expectedRel, $button->getRel() );
	}

	public static function provideSetNoFollow() {
		return [
			'NoFollow set to false' => [
				false, false, []
			],
			'NoFollow set to true' => [
				true, true, [ 'nofollow' ]
			]
		];
	}

	/**
	 * @covers \OOUI\ButtonWidget::getRel
	 * @dataProvider provideGetRel
	 * @param array $config
	 * @param array $expected
	 */
	public function testGetRel( array $config, array $expected ) {
		$button = new ButtonWidget( $config );

		$this->assertEquals( $expected, $button->getRel() );
		$this->assertEquals(
			in_array( 'nofollow', $button->getRel() ),
			$button->getNoFollow()
		);
	}

	public static function provideGetRel() {
		return [
			'Nothing' => [
				[],
				[ 'nofollow' ]
			],
			'NoFollow defined in rel' => [
				[ 'rel' => [ 'nofollow' ] ],
				[ 'nofollow' ]
			],
			'NoFollow disabled, but enabled in rel' => [
				[
					'rel' => 'nofollow',
					'noFollow' => false
				],
				[ 'nofollow' ]
			],
			'NoFollow explicitly set to false, other rel' => [
				[
					'rel' => 'noreferrer',
					'noFollow' => false
				],
				[ 'noreferrer' ]
			]
		];
	}

	/**
	 * @covers \OOUI\ButtonWidget::setRel
	 * @dataProvider provideSetRel
	 * @param array $rel
	 * @param array $expected
	 */
	public function testSetRel( array $rel, array $expected ) {
		$button = new ButtonWidget();
		$button->setRel( $rel );

		$this->assertEquals( $expected, $button->getRel() );
		$this->assertEquals(
			in_array( 'nofollow', $button->getRel() ),
			$button->getNoFollow()
		);
	}

	public static function provideSetRel() {
		return [
			'Set empty rel' => [
				[],
				[]
			],
			'Set nofollow' => [
				[ 'nofollow' ],
				[ 'nofollow' ]
			],
			'Set noreferrer' => [
				[ 'noreferrer' ],
				[ 'noreferrer' ]
			]
		];
	}
}
