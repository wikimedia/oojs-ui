<?php

class OoUiFormLayout extends OoUiLayout {

	/* Static properties */

	public static $tagName = 'form';

	/**
	 * Create form layout.
	 *
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Initialization
		$this->addClasses( array( 'oo-ui-formLayout' ) );
	}
}
