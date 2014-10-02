<?php

class OoUiWidget extends OoUiElement {

	/* Properties */

	/**
	 * Disabled.
	 *
	 * @var boolean Widget is disabled
	 */
	protected $disabled = false;

	/* Methods */

	/**
	 * Create widget.
	 *
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Initialize config
		$config = array_merge( array( 'disabled' => false ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Initialization
		$this->addClasses( array( 'oo-ui-widget' ) );
		$this->setDisabled( $config['disabled'] );
	}

	/**
	 * Check if the widget is disabled.
	 *
	 * @param boolean Button is disabled
	 */
	public function isDisabled() {
		return $this->disabled;
	}

	/**
	 * Set the disabled state of the widget.
	 *
	 * This should probably change the widgets' appearance and prevent it from being used.
	 *
	 * @param boolean disabled Disable widget
	 * @chainable
	 */
	public function setDisabled( $disabled ) {
		$this->disabled = !!$disabled;
		$this->toggleClasses( array( 'oo-ui-widget-disabled' ), $this->disabled );
		$this->toggleClasses( array( 'oo-ui-widget-enabled' ), !$this->disabled );

		return $this;
	}
}
