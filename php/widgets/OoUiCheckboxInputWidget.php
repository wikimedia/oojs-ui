<?php

class OoUiCheckboxInputWidget extends OoUiInputWidget {

	/**
	 * Create checkbox input widget.
	 *
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Initialization
		$this->addClasses( array( 'oo-ui-checkboxInputWidget' ) );
	}

	protected function getInputElement( $config ) {
		$input = new OoUiTag( 'input' );
		$input->setAttributes( array( 'type' => 'checkbox' ) );
		return $input;
	}

	/**
	 * Get checked state of the checkbox
	 *
	 * @return boolean If the checkbox is checked
	 */
	public function getValue() {
		return $this->value;
	}

	/**
	 * Set checked state of the checkbox
	 *
	 * @param boolean $value New value
	 * @chainable
	 */
	public function setValue( $value ) {
		$this->value = (bool)$value;
		if ( $this->value ) {
			$this->input->setAttributes( array( 'checked' => 'checked' ) );
		} else {
			$this->input->removeAttributes( array( 'checked' ) );
		}
		return $this;
	}
}
