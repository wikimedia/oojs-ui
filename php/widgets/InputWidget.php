<?php

namespace OOUI;

/**
 * Base class for input widgets.
 *
 * @abstract
 */
class InputWidget extends Widget {

	/* Static Properties */

	public static $supportsSimpleLabel = true;

	/* Properties */

	/**
	 * Input element.
	 *
	 * @var Tag
	 */
	protected $input;

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
	 * @param string $config['dir'] The directionality of the input (ltr/rtl)
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->input = $this->getInputElement( $config );

		// Mixins
		$this->mixin( new FlaggedElement( $this,
			array_merge( $config, array( 'flagged' => $this ) ) ) );
		$this->mixin( new TabIndexedElement( $this,
			array_merge( $config, array( 'tabIndexed' => $this->input ) ) ) );
		$this->mixin( new TitledElement( $this,
			array_merge( $config, array( 'titled' => $this->input ) ) ) );
		$this->mixin( new AccessKeyedElement( $this,
			array_merge( $config, array( 'accessKeyed' => $this->input ) ) ) );

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
		$this->input->addClasses( array( 'oo-ui-inputWidget-input' ) );
		$this->setValue( isset( $config['value'] ) ? $config['value'] : null );
		if ( isset( $config['dir'] ) ) {
			$this->setDir( $config['dir'] );
		}
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
	 * Set the directionality of the input, either RTL (right-to-left) or LTR (left-to-right).
	 *
	 * @deprecated since v0.13.1, use #setDir directly
	 * @param boolean $isRTL Directionality is right-to-left
	 * @return $this
	 */
	public function setRTL( $isRTL ) {
		$this->setDir( $isRTL ? 'rtl' : 'ltr' );
		return $this;
	}

	/**
	 * Set the directionality of the input.
	 *
	 * @param string $dir Text directionality: 'ltr', 'rtl' or 'auto'
	 * @return $this
	 */
	public function setDir( $dir ) {
		$this->input->setAttributes( array( 'dir' => $dir ) );
		return $this;
	}

	/**
	 * Set the value of the input.
	 *
	 * @param string $value New value
	 * @return $this
	 */
	public function setValue( $value ) {
		$this->value = $this->cleanUpValue( $value );
		$this->input->setValue( $this->value );
		return $this;
	}

	/**
	 * Clean up incoming value.
	 *
	 * Ensures value is a string, and converts null to empty string.
	 *
	 * @param string $value Original value
	 * @return string Cleaned up value
	 */
	protected function cleanUpValue( $value ) {
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

	public function getConfig( &$config ) {
		$name = $this->input->getAttribute( 'name' );
		if ( $name !== null ) {
			$config['name'] = $name;
		}
		if ( $this->value !== '' ) {
			$config['value'] = $this->value;
		}
		return parent::getConfig( $config );
	}
}
