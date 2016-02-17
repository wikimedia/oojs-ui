<?php

namespace OOUI;

/**
 * HorizontalLayout arranges its contents in a single line (using `display: inline-block` for its
 * items), with small margins between them.
 */
class HorizontalLayout extends Layout {
	/**
	 * @param array $config Configuration options
	 * @param Widget[]|Layout[] $config['items'] Widgets or other layouts to add to the layout.
	 */
	public function __construct( array $config = [] ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new GroupElement( $this, array_merge( $config, [ 'group' => $this ] ) ) );

		// Initialization
		$this->addClasses( [ 'oo-ui-horizontalLayout' ] );
		if ( isset( $config['items'] ) ) {
			$this->addItems( $config['items'] );
		}
	}
}
