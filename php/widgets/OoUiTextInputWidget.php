<?php

class OoUiTextInputWidget extends OoUiInputWidget {

	/* Properties */

	/**
	 * Allow multiple lines of text.
	 *
	 * @var boolean
	 */
	protected $multiline = false;

	/**
	 * Create text input widget.
	 *
	 * @param array $config Configuration options
	 * @param boolean $config['multiline'] Allow multiple lines of text (default: false)
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->multiline = isset( $config['multiline'] ) ? (bool)$config['multiline'] : false;

		// Mixins
		$this->mixin( new OoUiIconElement( $this, $config ) );
		$this->mixin( new OoUiIndicatorElement( $this, $config ) );

		// Initialization
		$this
			->addClasses( array( 'oo-ui-textInputWidget' ) )
			->appendContent( $this->icon, $this->indicator );
		if ( isset( $config['placeholder'] ) ) {
			$this->input->setAttributes( array( 'placeholder' => $config['placeholder'] ) );
		}
		$this->setAttributes( array( 'role' => 'textbox' ) );
	}

	/**
	 * Get input element.
	 *
	 * @param array $config Configuration options
	 * @return OoUiTag Input element
	 */
	protected function getInputElement( $config ) {
		if ( isset( $config['multiline'] ) && $config['multiline'] ) {
			return new OoUiTag( 'textarea' );
		} else {
			$input = new OoUiTag( 'input' );
			$input->setAttributes( array( 'type' => 'text' ) );
			return $input;
		}
	}

	/**
	 * Check if the widget is read-only.
	 *
	 * @return boolean
	 */
	public function isMultiLine() {
		return (bool)$this->multiline;
	}
}
