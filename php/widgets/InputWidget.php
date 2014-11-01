<?php

namespace OOUI;

/**
 * Base class for input widgets.
 */
class InputWidget extends Widget {

	/* Properties */

	/**
	 * Input value.
	 *
	 * @var string
	 */
	protected $value = '';

	/**
	 * @param array $config Configuration options
	 * @param string $config['name'] HTML input name (default: '')
	 * @param string $config['value'] Input value (default: '')
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->input = $this->getInputElement( $config );

		// Mixins
		$this->mixin( new FlaggedElement( $this,
			array_merge( $config, array( 'flagged' => $this ) ) ) );

		// Initialization
		if ( isset( $config['name'] ) ) {
			$this->input->setAttributes( array( 'name' => $config['name'] ) );
		}
		if ( $this->isDisabled() ) {
			$this->input->setAttributes( array( 'disabled' => 'disabled' ) );
		}
		$this
			->addClasses( array( 'oo-ui-inputWidget' ) )
			->appendContent( $this->input );
		$this->setValue( isset( $config['value'] ) ? $config['value'] : null );
	}

	/**
	 * Get input element.
	 *
	 * @param array $config Configuration options
	 * @return Tag Input element
	 */
	protected function getInputElement( $config ) {
		return new Tag( 'input' );
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
