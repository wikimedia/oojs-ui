<?php

class OoUiIndicatorWidget extends OoUiWidget {

	/* Static properties */

	public static $tagName = 'span';

	/**
	 * Create indicator widget.
	 *
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiIndicatorElement( $this,
			array_merge( $config, array( 'indicatorElement' => $this ) ) ) );
		$this->mixin( new OoUiTitledElement( $this,
			array_merge( $config, array( 'titled' => $this ) ) ) );

		// Initialization
		$this->addClasses( array( 'oo-ui-indicatorWidget' ) );
	}
}
