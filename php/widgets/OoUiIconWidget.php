<?php

/**
 * Icon widget.
 *
 * See OoUiIconElement for more information.
 */
class OoUiIconWidget extends OoUiWidget {

	/* Static properties */

	public static $tagName = 'span';

	/**
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiIconElement( $this,
			array_merge( $config, array( 'iconElement' => $this ) ) ) );
		$this->mixin( new OoUiTitledElement( $this,
			array_merge( $config, array( 'titled' => $this ) ) ) );

		// Initialization
		$this->addClasses( array( 'oo-ui-iconWidget' ) );
	}
}
