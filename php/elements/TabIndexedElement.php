<?php

namespace OOUI;

/**
 * Element supporting "sequential focus navigation" using the 'tabindex' attribute.
 *
 * @abstract
 */
class TabIndexedElement extends ElementMixin {
	/**
	 * Tab index value.
	 *
	 * @var number
	 */
	protected $tabIndex = null;

	public static $targetPropertyName = 'tabIndexed';

	/**
	 * @param Element $element Element being mixed into
	 * @param array $config Configuration options
	 * @param number $config['tabIndex'] Tab index value. Use 0 to use default ordering, use -1 to
	 *   prevent tab focusing. (default: 0)
	 */
	public function __construct( Element $element, array $config = array() ) {
		// Parent constructor
		$target = isset( $config['tabIndexed'] ) ? $config['tabIndexed'] : $element;
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->setTabIndex( isset( $config['tabIndex'] ) ? $config['tabIndex'] : 0 );
	}

	/**
	 * Set tab index value.
	 *
	 * @param number|null $tabIndex Tab index value or null for no tabIndex
	 * @chainable
	 */
	public function setTabIndex( $tabIndex ) {
		$tabIndex = is_numeric( $tabIndex ) ? $tabIndex : null;

		if ( $this->tabIndex !== $tabIndex ) {
			if ( $tabIndex !== null ) {
				$this->target->setAttributes( array(
					// Do not index over disabled elements
					'tabindex' => $this->element->isDisabled() ? -1 : $tabIndex,
					// ChromeVox and NVDA do not seem to inherit this from parent elements
					'aria-disabled' => $this->element->isDisabled() ? 'true' : 'false',
				) );
			} else {
				$this->target->removeAttributes( array( 'tabindex', 'aria-disabled' ) );
			}
			$this->tabIndex = $tabIndex;
		}

		return $this;
	}

	/**
	 * Get tab index value.
	 *
	 * @return number Tab index value
	 */
	public function getTabIndex() {
		return $this->tabIndex;
	}
}
