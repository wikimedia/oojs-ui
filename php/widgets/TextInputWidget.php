<?php

namespace OOUI;

/**
 * Input widget with a text field.
 */
class TextInputWidget extends InputWidget {

	/* Properties */

	/**
	 * Prevent chages.
	 *
	 * @var boolean
	 */
	protected $readOnly = false;

	/**
	 * Allow multiple lines of text.
	 *
	 * @var boolean
	 */
	protected $multiline = false;

	/**
	 * @param array $config Configuration options
	 * @param string $config['type'] HTML tag `type` attribute (default: 'text')
	 * @param string $config['placeholder'] Placeholder text
	 * @param boolean $config['readOnly'] Prevent changes (default: false)
	 * @param boolean $config['multiline'] Allow multiple lines of text (default: false)
	 */
	public function __construct( array $config = array() ) {
		// Config initialization
		$config = array_merge( array( 'readOnly' => false ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Properties
		$this->multiline = isset( $config['multiline'] ) ? (bool)$config['multiline'] : false;

		// Mixins
		$this->mixin( new IconElement( $this, $config ) );
		$this->mixin( new IndicatorElement( $this, $config ) );

		// Initialization
		$this
			->addClasses( array( 'oo-ui-textInputWidget' ) )
			->appendContent( $this->icon, $this->indicator );
		$this->setReadOnly( $config['readOnly'] );
		if ( isset( $config['placeholder'] ) ) {
			$this->input->setAttributes( array( 'placeholder' => $config['placeholder'] ) );
		}
		$this->setAttributes( array( 'role' => 'textbox' ) );
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
	 * Set the read-only state of the widget. This should probably change the widget's appearance and
	 * prevent it from being used.
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

	/**
	 * Get input element.
	 *
	 * @param array $config Configuration options
	 * @return Tag Input element
	 */
	protected function getInputElement( $config ) {
		if ( isset( $config['multiline'] ) && $config['multiline'] ) {
			return new Tag( 'textarea' );
		} else {
			$type = isset( $config['type'] ) ? $config['type'] : 'text';
			$input = new Tag( 'input' );
			$input->setAttributes( array( 'type' => $type ) );
			return $input;
		}
	}

	/**
	 * Check if input supports multiple lines.
	 *
	 * @return boolean
	 */
	public function isMultiline() {
		return (bool)$this->multiline;
	}
}
