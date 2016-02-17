<?php

namespace OOUI;

/**
 * Indicator widget.
 *
 * See IndicatorElement for more information.
 */
class IndicatorWidget extends Widget {

	/* Static Properties */

	public static $tagName = 'span';

	/**
	 * @param array $config Configuration options
	 */
	public function __construct( array $config = [] ) {
		// Parent constructor
		parent::__construct( $config );

		// Mixins
		$this->mixin( new IndicatorElement( $this,
			array_merge( $config, [ 'indicatorElement' => $this ] ) ) );
		$this->mixin( new TitledElement( $this,
			array_merge( $config, [ 'titled' => $this ] ) ) );

		// Initialization
		$this->addClasses( [ 'oo-ui-indicatorWidget' ] );
	}
}
