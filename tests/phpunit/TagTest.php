<?php

namespace OOUI\Tests;

use OOUI\Tag;

class TagTest extends \PHPUnit\Framework\TestCase {

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
	 * @covers Tag::appendContent
	 * @covers Tag::prependContent
	 * @covers Tag::clearContent
	 */
	public function testContent() {
		$content = new \ReflectionProperty( 'OOUI\Tag', 'content' );
		$content->setAccessible( true );
		$tag = new Tag( 'div' );
		$aTag = new Tag( 'a' );
		$bTag = new Tag( 'b' );
		$cTag = new Tag( 'c' );

		$tag->appendContent( 'a' );
		$this->assertEquals( [ 'a' ], $content->getValue( $tag ) );
		$tag->clearContent();
		$this->assertEquals( [], $content->getValue( $tag ) );

		$tag->appendContent( [ 'a', 'b' ] );
		$this->assertEquals( [ 'a', 'b' ], $content->getValue( $tag ) );
		// Strings can be duplicated
		$tag->appendContent( [ 'b', 'a' ] );
		$this->assertEquals( [ 'a', 'b', 'b', 'a' ], $content->getValue( $tag ) );
		$tag->clearContent();

		$tag->appendContent( 'a', 'b' );
		$this->assertEquals( [ 'a', 'b' ], $content->getValue( $tag ) );
		$tag->clearContent();

		$tag->appendContent( 'a' );
		$tag->appendContent( 'b' );
		$this->assertEquals( [ 'a', 'b' ], $content->getValue( $tag ) );
		$tag->clearContent();

		$tag->prependContent( [ 'a', 'b' ] );
		$this->assertEquals( [ 'a', 'b' ], $content->getValue( $tag ) );
		$tag->clearContent();

		$tag->prependContent( 'a', 'b' );
		$this->assertEquals( [ 'a', 'b' ], $content->getValue( $tag ) );
		$tag->clearContent();

		$tag->prependContent( 'a' );
		$tag->prependContent( 'b' );
		$this->assertEquals( [ 'b', 'a' ], $content->getValue( $tag ) );
		$tag->clearContent();

		// Tags can't be duplicated
		$tag->appendContent( [ $aTag, $bTag ] );
		$tag->appendContent( [ $bTag, $cTag ] );
		$this->assertEquals( [ $aTag, $bTag, $cTag ], $content->getValue( $tag ) );
		$tag->clearContent();

		$tag->prependContent( [ $aTag, $bTag ] );
		$tag->prependContent( [ $bTag, $cTag ] );
		$this->assertEquals( [ $bTag, $cTag, $aTag ], $content->getValue( $tag ) );
		$tag->clearContent();

		// Tags aren't compared with strings
		$tag->appendContent( '<a></a>' );
		$tag->appendContent( $aTag );
		$this->assertEquals( [ '<a></a>', $aTag ], $content->getValue( $tag ) );
		$tag->clearContent();
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
	 * @covers Tag::toString
	 * @dataProvider provideToString
	 */
	public function testToString( $tag, $expected ) {
		$this->assertEquals( $expected, $tag->toString() );
	}

	public static function provideToString() {
		return [
			[ ( new Tag( 'div' ) ),
				'<div></div>' ],
			[ ( new Tag( 'input' ) ),
				'<input />' ],
		];
	}

	/**
	 * @covers Tag::isSafeUrl
	 * @dataProvider provideIsSafeUrl
	 */
	public function testIsSafeUrl( $url, $expected ) {
		$this->assertEquals( $expected, Tag::isSafeUrl( $url ) );
	}

	/**
	 * @note Keep tests in sync with core.test.js
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
