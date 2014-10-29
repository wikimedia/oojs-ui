<?php

/**
 * Element containing an icon.
 *
 * Icons are graphics, about the size of normal text. They can be used to aid the user in locating
 * a control or convey information in a more space efficient way. Icons should rarely be used
 * without labels; such as in a toolbar where space is at a premium or within a context where the
 * meaning is very clear to the user.
 */
class OoUiIconElement extends OoUiElementMixin {
	/**
	 * Symbolic icon name.
	 *
	 * @var string
	 */
	protected $icon = null;

	public static $targetPropertyName = 'icon';

	/**
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['icon'] Symbolic icon name
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
	 * Set icon name.
	 *
	 * @param string|null $icon Symbolic icon name
	 * @chainable
	 */
	public function setIcon( $icon = null ) {
		if ( $this->icon !== null ) {
			$this->target->removeClasses( array( 'oo-ui-icon-' . $this->icon ) );
		}
		if ( $icon !== null ) {
			$this->target->addClasses( array( 'oo-ui-icon-' . $icon ) );
		}

		$this->icon = $icon;
		$this->element->toggleClasses( array( 'oo-ui-iconElement' ), (bool)$this->icon );

		return $this;
	}

	/**
	 * Get icon name.
	 *
	 * @return string Icon name
	 */
	public function getIcon() {
		return $this->icon;
	}
}
