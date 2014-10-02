<?php

class OoUiIconElement extends OoUiElementMixin {
	/**
	 * Icon value.
	 *
	 * @var string
	 */
	protected $icon = null;

	public static $targetPropertyName = 'icon';

	/**
	 * Mixin icon element.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['icon'] Icon value
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		// FIXME 'iconElement' is a very stupid way to call '$icon'
		$target = isset( $config['iconElement'] ) ? $config['iconElement'] : new OoUiTag( 'span' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->target->addClasses( array( 'oo-ui-iconElement-icon' ) );
		$this->setIcon( isset( $config['icon'] ) ? $config['icon'] : null );
	}

	/**
	 * Set icon value.
	 *
	 * @param string $icon Icon value
	 * @chainable
	 */
	public function setIcon( $icon = null ) {
		$this->icon = is_string( $icon ) ? $icon : null;
		$this->element->toggleClasses( array( 'oo-ui-iconElement' ), !!$this->icon );
		$this->target->addClasses( array( 'oo-ui-icon-' . $this->icon ) );
		return $this;
	}

	/**
	 * Get icon value.
	 *
	 * @return string Icon value
	 */
	public function getIcon() {
		return $this->icon;
	}
}
