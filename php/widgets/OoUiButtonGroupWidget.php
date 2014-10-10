<?php

class OoUiButtonGroupWidget extends OoUiWidget {
	/**
	 * Create button group widget.
	 *
	 * @param array $config Configuration options
	 * @param array $config['items'] Buttons to add
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiGroupElement( $this, array_merge( $config, array( 'group' => $this ) ) ) );

		// Initialization
		$this->addClasses( array( 'oo-ui-buttonGroupWidget' ) );
		if ( isset( $config['items'] ) ) {
			$this->addItems( $config['items'] );
		}
	}
}
