<?php

class OoUiButtonInputWidget extends OoUiInputWidget {
	/**
	 * Create button input widget.
	 *
	 * @param array $config Configuration options
	 * @param string $config['type'] HTML tag `type` attribute, may be 'button', 'submit' or 'reset'
	 *   (default: 'button')
	 * @param boolean $config['useInputTag'] Whether to use `<input/>` rather than `<button/>`. Only
	 *   useful if you need IE 6 support in a form with multiple buttons. By using this option, you
	 *   sacrifice icons and indicators, as well as the ability to have non-plaintext label or a
	 *   label different from the value. (default: false)
	 */
	public function __construct( array $config = array() ) {
		// Configuration initialization
		$config = array_merge( array( 'type' => 'button', 'useInputTag' => false ), $config );

		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new OoUiButtonElement( $this,
			array_merge( $config, array( 'button' => $this->input ) ) ) );
		$this->mixin( new OoUiIconElement( $this, $config ) );
		$this->mixin( new OoUiIndicatorElement( $this, $config ) );
		// HACK: We need to have access to the mixin to override the setLabel() method
		$this->mixin( $this->labelElementMixin = new OoUiLabelElement( $this, $config ) );
		$this->mixin( new OoUiTitledElement( $this,
			array_merge( $config, array( 'titled' => $this->input ) ) ) );
		$this->mixin( new OoUiFlaggedElement( $this, $config ) );

		// Properties
		$this->useInputTag = $config['useInputTag'];

		// Initialization
		if ( !$config['useInputTag'] ) {
			$this->input->appendContent( $this->icon, $this->label, $this->indicator );
		}

		// HACK: This is done in LabelElement mixin, but doesn't call our overridden method because of
		// how we implement mixins. Switching to traits will fix that.
		$this->setLabel( isset( $config['label'] ) ? $config['label'] : null );

		$this->addClasses( array( 'oo-ui-buttonInputWidget' ) );
	}

	/**
	 * Get input element.
	 *
	 * @param array $config Configuration options
	 * @return OoUiTag Input element
	 */
	protected function getInputElement( $config ) {
		$input = new OoUiTag( $config['useInputTag'] ? 'input' : 'button' );
		$input->setAttributes( array( 'type' => $config['type'] ) );
		return $input;
	}

	/**
	 * Set label value.
	 *
	 * Overridden to support setting the 'value' of `<input/>` elements.
	 *
	 * @param string $label Label value
	 * @chainable
	 */
	public function setLabel( $label ) {
		$this->labelElementMixin->setLabel( $label );

		if ( $this->useInputTag ) {
			$label = is_string( $label ) ? $label : '';
			$this->input->setValue( $label );
		}

		return $this;
	}
}
