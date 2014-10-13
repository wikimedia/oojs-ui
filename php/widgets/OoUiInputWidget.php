<?php

class OoUiInputWidget extends OoUiWidget {

	/* Properties */

	/**
	 * Input value.
	 *
	 * @var string
	 */
	protected $value = '';

	/**
	 * Prevent chages.
	 *
	 * @var boolean
	 */
	protected $readOnly = false;

	/**
	 * Create input widget.
	 *
	 * @param array $config Configuration options
	 * @param string $config['name'] HTML input name (default: '')
	 * @param string $config['value'] Input value (default: '')
	 * @param boolean $config['readOnly'] Prevent changes (default: false)
	 */
	public function __construct( array $config = array() ) {
		// Config initialization
		$config = array_merge( array( 'readOnly' => false ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->input = $this->getInputElement( $config );

		// Mixins
		$this->mixin( new OoUiFlaggedElement( $this,
			array_merge( $config, array( 'flagged' => $this ) ) ) );

		// Initialization
		if ( isset( $config['name'] ) ) {
			$this->input->setAttributes( array( 'name' => $config['name'] ) );
		}
		if ( $this->isDisabled() ) {
			$this->input->setAttributes( array( 'disabled' => 'disabled' ) );
		}
		$this->setReadOnly( $config['readOnly'] );
		$this
			->addClasses( array( 'oo-ui-inputWidget' ) )
			->appendContent( $this->input );
		$this->setValue( isset( $config['value'] ) ? $config['value'] : null );
	}

	/**
	 * Get input element.
	 *
	 * @param array $config Configuration options
	 * @return OoUiTag Input element
	 */
	protected function getInputElement( $config ) {
		return new OoUiTag( 'input' );
	}

	/**
	 * Get the value of the input.
	 *
	 * @return string Input value
	 */
	public function getValue() {
		return $this->value;
	}

	/**
	 * Sets the direction of the current input, either RTL or LTR
	 *
	 * @param boolean $isRTL
	 */
	public function setRTL( $isRTL ) {
		if ( $isRTL ) {
			$this->input->removeClasses( array( 'oo-ui-ltr' ) );
			$this->input->addClasses( array( 'oo-ui-rtl' ) );
		} else {
			$this->input->removeClasses( array( 'oo-ui-rtl' ) );
			$this->input->addClasses( array( 'oo-ui-ltr' ) );
		}
	}

	/**
	 * Set the value of the input.
	 *
	 * @param string $value New value
	 * @chainable
	 */
	public function setValue( $value ) {
		$this->value = $this->sanitizeValue( $value );
		$this->input->setValue( $this->value );
		return $this;
	}

	/**
	 * Sanitize incoming value.
	 *
	 * Ensures value is a string, and converts null to empty string.
	 *
	 * @param string $value Original value
	 * @return string Sanitized value
	 */
	protected function sanitizeValue( $value ) {
		if ( $value === null ) {
			return '';
		} else {
			return (string)$value;
		}
	}

	/**
	 * Check if the widget is read-only.
	 *
	 * @return boolean
	 */
	public function isReadOnly() {
		return $this->readOnly;
	}

	/**
	 * Set the read-only state of the widget.
	 *
	 * @param boolean $state Make input read-only
	 * @chainable
	 */
	public function setReadOnly( $state ) {
		$this->readOnly = (bool)$state;
		if ( $this->readOnly ) {
			$this->input->setAttributes( array( 'readonly' => 'readonly' ) );
		} else {
			$this->input->removeAttributes( array( 'readonly' ) );
		}
		return $this;
	}

	public function setDisabled( $state ) {
		parent::setDisabled( $state );
		if ( isset( $this->input ) ) {
			if ( $this->isDisabled() ) {
				$this->input->setAttributes( array( 'disabled' => 'disabled' ) );
			} else {
				$this->input->removeAttributes( array( 'disabled' ) );
			}
		}
		return $this;
	}
}
