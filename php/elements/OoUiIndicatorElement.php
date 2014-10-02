<?php

class OoUiIndicatorElement extends OoUiElementMixin {
	/**
	 * Indicator value.
	 *
	 * @var string
	 */
	protected $indicator = null;

	public static $targetPropertyName = 'indicator';

	/**
	 * Mixin indicator element.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['indicator'] Indicator value
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		// FIXME 'indicatorElement' is a very stupid way to call '$indicator'
		$target = isset( $config['indicatorElement'] )
			? $config['indicatorElement']
			: new OoUiTag( 'span' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->target->addClasses( array( 'oo-ui-indicatorElement-indicator' ) );
		$this->setIndicator( isset( $config['indicator'] ) ? $config['indicator'] : null );
	}

	/**
	 * Set indicator value.
	 *
	 * @param string $indicator Indicator value
	 * @chainable
	 */
	public function setIndicator( $indicator = null ) {
		$this->indicator = is_string( $indicator ) ? $indicator : null;
		$this->element->toggleClasses( array( 'oo-ui-indicatorElement' ), !!$this->indicator );
		$this->target->addClasses( array( 'oo-ui-indicator-' . $this->indicator ) );
		return $this;
	}

	/**
	 * Get indicator value.
	 *
	 * @return string Indicator value
	 */
	public function getIndicator() {
		return $this->indicator;
	}
}
