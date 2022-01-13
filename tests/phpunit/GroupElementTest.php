<?php

namespace OOUI\Tests;

use OOUI\Element;
use OOUI\GroupElement;

/**
 * @covers \OOUI\GroupElement
 */
class GroupElementTest extends TestCase {

	public function testAddItemsWithArrayKeys() {
		$element = new class extends Element {
			use GroupElement;
		};
		$element->initializeGroupElement();

		$this->expectError();
		$element->addItems( [ 'foo' => new Element() ] );
	}

}
