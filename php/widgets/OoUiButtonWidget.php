<?php

class OoUiButtonWidget extends OoUiWidget {
	/**
	 * Create button widget.
	 *
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiButtonElement( $this, $config ) );
		$this->mixin( new OoUiLabelElement( $this, $config ) );
		$this->mixin( new OoUiIconElement( $this, $config ) );
		$this->mixin( new OoUiIndicatorElement( $this, $config ) );
		$this->mixin( new OoUiFlaggedElement( $this, $config ) );

		// Initialization
		$this->button->appendContent( $this->icon, $this->label, $this->indicator );
		$this
			->addClasses( array( 'oo-ui-buttonWidget' ) )
			->appendContent( $this->button );
	}
}
