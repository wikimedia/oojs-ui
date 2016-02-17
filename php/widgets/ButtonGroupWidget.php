<?php

namespace OOUI;

/**
 * Group widget for multiple related buttons.
 *
 * Use together with ButtonWidget.
 */
class ButtonGroupWidget extends Widget {
	/**
	 * @param array $config Configuration options
	 * @param ButtonWidget[] $config['items'] Buttons to add
	 */
	public function __construct( array $config = [] ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new GroupElement( $this, array_merge( $config, [ 'group' => $this ] ) ) );

		// Initialization
		$this->addClasses( [ 'oo-ui-buttonGroupWidget' ] );
		if ( isset( $config['items'] ) ) {
			$this->addItems( $config['items'] );
		}
	}
}
