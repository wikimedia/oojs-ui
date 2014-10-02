<?php

class OoUiTheme {

	/* Members */

	public static $current;

	/* Methods */

	/**
	 * Create theme.
	 */
	public function __construct() {
		// Initialization
		static::$current = $this;
	}

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
		return array( 'on' => array(), 'off' => array() );
	}

	/**
	 * Update CSS classes provided by the theme.
	 *
	 * For elements with theme logic hooks, this should be called anytime there's a state change.
	 *
	 * @param OoUiElement Element for which to update classes
	 * @return array Categorized class names with `on` and `off` lists
	 */
	public function updateElementClasses( OoUiElement $element ) {
		$classes = $this->getElementClasses( $element );

		$element
			->removeClasses( $classes['off'] )
			->addClasses( $classes['on'] );
	}
}
