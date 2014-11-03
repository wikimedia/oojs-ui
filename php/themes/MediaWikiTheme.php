<?php

namespace OOUI;

class MediaWikiTheme extends Theme {

	/* Methods */

	public function getElementClasses( Element $element ) {
		$variants = array(
			'invert' => false,
			'primary' => false,
			'constructive' => false,
			'destructive' => false
		);

		// Parent method
		$classes = parent::getElementClasses( $element );

		if ( $element->supports( array( 'isFramed', 'isDisabled', 'hasFlag' ) ) ) {
			if ( $element->isFramed() && !$element->isDisabled() ) {
				if (
					$element->hasFlag( 'primary' ) ||
					$element->hasFlag( 'constructive' ) ||
					$element->hasFlag( 'destructive' )
				) {
					$variants['invert'] = true;
				}
			} else {
				$variants['primary'] = $element->hasFlag( 'primary' );
				$variants['constructive'] = $element->hasFlag( 'constructive' );
				$variants['destructive'] = $element->hasFlag( 'destructive' );
			}
		}

		foreach ( $variants as $variant => $toggle ) {
			$classes[$toggle ? 'on' : 'off'][] = 'oo-ui-image-' . $variant;
		}

		return $classes;
	}
}
