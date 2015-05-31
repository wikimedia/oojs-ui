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
		$tag = new Tag();
		$tag->addClasses( array( 'class1', 'class2' ) );
		$this->assertTrue( $tag->hasClass( 'class1' ) );
		$this->assertTrue( $tag->hasClass( 'class2' ) );
		$tag->removeClasses( array( 'class1' ) );
		$this->assertFalse( $tag->hasClass( 'class1' ) );
		$this->assertTrue( $tag->hasClass( 'class2' ) );
	}

	/**
	 * @covers Tag::setAttributes
	 * @covers Tag::getAttribute
	 * @covers Tag::removeAttributes
	 */
	public function testAttributes() {
		$tag = new Tag();
		$tag->setAttributes( array(
			'attr1' => 'foo',
			'attr2' => 'bar',
		) );
		$this->assertEquals( 'foo', $tag->getAttribute( 'attr1' ) );
		$this->assertEquals( 'bar', $tag->getAttribute( 'attr2' ) );
		$this->assertEquals( null, $tag->getAttribute( 'attr3' ) );
		$tag->removeAttributes( array( 'attr1' ) );
		$this->assertEquals( null, $tag->getAttribute( 'attr1' ) );
		$this->assertEquals( 'bar', $tag->getAttribute( 'attr2' ) );
	}

	/**
	 * @covers Tag::ensureInfusableId
	 */
	public function testEnsureInfusableId() {
		$tag = new Tag();
		$tag2 = new Tag();
		$tag3 = new Tag();
		$tag->setAttributes( array( 'id' => 'foobar' ) );
		$tag->ensureInfusableId();
		$tag2->ensureInfusableId();
		$tag3->ensureInfusableId();
		// All have ids set
		$this->assertNotNull( $tag->getAttribute( 'id' ) );
		$this->assertNotNull( $tag2->getAttribute( 'id' ) );
		$this->assertNotNull( $tag3->getAttribute( 'id' ) );
	}

	/**
	 * @todo incomplete
	 * @covers Tag::toString
	 * @dataProvider provideToString
	 */
	public function testToString( Tag $tag, $expected, $exception = false) {
		if ( $exception ) {
			$this->setExpectedException( $exception );
		}
		$this->assertEquals( $expected, $tag->toString() );
	}

	public static function provideToString() {
		$tests = array();
		$tag = new Tag();
		$tag->setAttributes( array( 'foobar@invalidkey' => 'blah' ) );
		$tests[] = array( $tag, '', 'Exception' );
		$tag2 = new Tag();
		$tag2->setAttributes( array( 'href' => 'javascript:evil();' ) );
		$tests[] = array( $tag2, '', 'Exception' );
		return $tests;
	}
}
