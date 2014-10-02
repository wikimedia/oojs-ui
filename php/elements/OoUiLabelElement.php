<?php

class OoUiLabelElement extends OoUiElementMixin {
	/**
	 * Label value.
	 *
	 * @var string
	 */
	protected $label;

	public static $targetPropertyName = 'label';

	/**
	 * Mixin label element.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['label'] Label value
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		// FIXME 'labelElement' is a very stupid way to call '$label'
		$target = isset( $config['labelElement'] ) ? $config['labelElement'] : new OoUiTag( 'span' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->target->addClasses( array( 'oo-ui-labelElement-label' ) );
		$this->setLabel( isset( $config['label'] ) ? $config['label'] : null );
	}

	/**
	 * Set label value.
	 *
	 * @param string $label Label value
	 * @chainable
	 */
	public function setLabel( $label ) {
		$this->label = is_string( $label ) ? $label : null;
		$this->element->toggleClasses( array( 'oo-ui-labelElement' ), !!$this->label );
		$this->target->clearContent();
		if ( $this->label ) {
			$this->target->appendContent( $label );
		}
		return $this;
	}

	/**
	 * Get label value.
	 *
	 * @return string Label value
	 */
	public function getLabel() {
		return $this->label;
	}
}
