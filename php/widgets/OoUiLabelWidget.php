<?php

/**
 * Label widget.
 */
class OoUiLabelWidget extends OoUiWidget {

	/* Static properties */

	public static $tagName = 'span';

	/**
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiLabelElement( $this,
			array_merge( $config, array( 'labelElement' => $this ) ) ) );

		// Properties
		$this->input = isset( $config['input'] ) ? $config['input'] : null;

		// Initialization
		$this->addClasses( array( 'oo-ui-labelWidget' ) );
	}
}
