<?php

namespace OOUI;

/**
 * Icon widget.
 *
 * See IconElement for more information.
 */
class IconWidget extends Widget {

	/* Static Properties */

	public static $tagName = 'span';

	/**
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = [] ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new IconElement( $this,
			array_merge( $config, [ 'iconElement' => $this ] ) ) );
		$this->mixin( new TitledElement( $this,
			array_merge( $config, [ 'titled' => $this ] ) ) );
		$this->mixin( new FlaggedElement( $this,
			array_merge( $config, [ 'flagged' => $this ] ) ) );

		// Initialization
		$this->addClasses( [ 'oo-ui-iconWidget' ] );
	}
}
