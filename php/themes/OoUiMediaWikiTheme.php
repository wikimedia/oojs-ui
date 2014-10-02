<?php

class OoUiMediaWikiTheme extends OoUiTheme {

	/* Methods */

	/**
	 * Get a list of classes to be applied to a widget.
	 *
	 * @localdoc The 'on' and 'off' lists combined MUST contain keys for all classes the theme adds or
	 *   removes, otherwise state transitions will not work properly.
	 *
	 * @param OoUiElement $element Element for which to get classes
	 * @return array Categorized class names with `on` and `off` lists
	 */
	public function getElementClasses( OoUiElement $element ) {
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
