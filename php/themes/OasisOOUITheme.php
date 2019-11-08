<?php

namespace OOUI;

class OasisOOUITheme extends Theme {

	/* Methods */

	public function getElementClasses( Element $element ) {
		$classes = parent::getElementClasses( $element );

		if ( $element instanceof TabSelectWidget ) {
			$classes['on'][] = 'wds-tabs';
		}

		return $classes;
	}

	public function updateElementClasses( Element $element ) {
		$classes = $this->getElementClasses( $element );
		$element->removeClasses( $classes['off'] )
		        ->addClasses( $classes['on'] );
	}
}
