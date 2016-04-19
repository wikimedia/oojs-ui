<?php

namespace OOUI;

/**
 * Element containing an icon.
 *
 * Icons are graphics, about the size of normal text. They can be used to aid the user in locating
 * a control or convey information in a more space efficient way. Icons should rarely be used
 * without labels; such as in a toolbar where space is at a premium or within a context where the
 * meaning is very clear to the user.
 *
 * @abstract
 */
class IconElement extends ElementMixin {
	/**
	 * Symbolic icon name.
	 *
	 * @var string
	 */
	protected $iconName = null;

	public static $targetPropertyName = 'icon';

	/**
	 * @param Element $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['icon'] Symbolic icon name
	 */
	public function __construct( Element $element, array $config = [] ) {
		// Parent constructor
		// FIXME 'iconElement' is a very stupid way to call '$icon'
		$target = isset( $config['iconElement'] ) ? $config['iconElement'] : new Tag( 'span' );
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->target->addClasses( [ 'oo-ui-iconElement-icon' ] );
		$this->setIcon( isset( $config['icon'] ) ? $config['icon'] : null );
	}

	/**
	 * Set icon name.
	 *
	 * @param string|null $icon Symbolic icon name
	 * @return $this
	 */
	public function setIcon( $icon = null ) {
		if ( $this->iconName !== null ) {
			$this->target->removeClasses( [ 'oo-ui-icon-' . $this->iconName ] );
		}
		if ( $icon !== null ) {
			$this->target->addClasses( [ 'oo-ui-icon-' . $icon ] );
		}

		$this->iconName = $icon;
		$this->element->toggleClasses( [ 'oo-ui-iconElement' ], (bool)$this->iconName );

		return $this;
	}

	/**
	 * Get icon name.
	 *
	 * @return string Icon name
	 */
	public function getIcon() {
		return $this->iconName;
	}

	public function getConfig( &$config ) {
		if ( $this->iconName !== null ) {
			$config['icon'] = $this->iconName;
		}
		return parent::getConfig( $config );
	}
}
