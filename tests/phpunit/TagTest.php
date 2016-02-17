<?php

namespace OOUI\Tests;

use PHPUnit_Framework_TestCase;
use OOUI\Tag;

class TagTest extends PHPUnit_Framework_TestCase {

	/**
	 * @covers Tag::__construct
	 */
	public function testConstructor() {
		$this->assertInstanceOf( 'OOUI\Tag', new Tag() );
		$this->assertInstanceOf( 'OOUI\Tag', new Tag( 'input' ) );
	}

	/**
	 * @covers Tag::addClasses
	 * @covers Tag::removeClasses
	 * @covers Tag::hasClass
	 */
	public function testClasses() {
		$tag = ( new Tag() )->addClasses( [ 'class1', 'class2' ] );
		$this->assertTrue( $tag->hasClass( 'class1' ) );
		$this->assertTrue( $tag->hasClass( 'class2' ) );
		$tag->removeClasses( [ 'class1' ] );
		$this->assertFalse( $tag->hasClass( 'class1' ) );
		$this->assertTrue( $tag->hasClass( 'class2' ) );
	}

	/**
	 * @covers Tag::setAttributes
	 * @covers Tag::getAttribute
	 * @covers Tag::removeAttributes
	 */
	public function testAttributes() {
		$tag = ( new Tag() )->setAttributes( [
			'attr1' => 'foo',
			'attr2' => 'bar',
		] );
		$this->assertEquals( 'foo', $tag->getAttribute( 'attr1' ) );
		$this->assertEquals( 'bar', $tag->getAttribute( 'attr2' ) );
		$this->assertEquals( null, $tag->getAttribute( 'attr3' ) );
		$tag->removeAttributes( [ 'attr1' ] );
		$this->assertEquals( null, $tag->getAttribute( 'attr1' ) );
		$this->assertEquals( 'bar', $tag->getAttribute( 'attr2' ) );
	}

	/**
	 * @covers Tag::ensureInfusableId
	 */
	public function testEnsureInfusableId() {
		$tag = ( new Tag() )->setAttributes( [ 'id' => 'foobar' ] );
		$tag2 = new Tag();
		$tag3 = new Tag();
		$tag->ensureInfusableId();
		$tag2->ensureInfusableId();
		$tag3->ensureInfusableId();
		// All have ids set
		$this->assertNotNull( $tag->getAttribute( 'id' ) );
		$this->assertNotNull( $tag2->getAttribute( 'id' ) );
		$this->assertNotNull( $tag3->getAttribute( 'id' ) );
	}

	/**
	 * @covers Tag::isSafeUrl
	 * @dataProvider provideIsSafeUrl
	 */
	public function testIsSafeUrl( $url, $expected ) {
		$this->assertEquals( $expected, Tag::isSafeUrl( $url ) );
	}

	/**
	 * @note: Keep tests in sync with core.test.js
	 */
	public static function provideIsSafeUrl() {
		return [
			[ 'javascript:evil();', false ],
			[ 'foo:bar', false ],
			[ 'relative.html', false ],
			[ '', true ],
			[ 'http://example.com/', true ],
			[ '//example.com/', true ],
			[ '/', true ],
			[ '..', false ],
			[ '?foo=bar', true ],
			[ '#top', true ],
			[ '/relative', true ],
			[ './relative', true ],
			[ '/wiki/Extra:Colon', true ],
		];
	}
}
