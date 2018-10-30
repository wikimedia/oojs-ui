<?php

namespace OOUI;

/**
 * Indicator widget.
 *
 * See IndicatorElement for more information.
 */
class IndicatorWidget extends Widget {
	use IndicatorElement;
	use TitledElement;
	use LabelElement;

	/* Static Properties */

	public static $tagName = 'span';

	/**
	 * @param array $config Configuration options
	 * @param-taint $config escapes_html
	 */
	public function __construct( array $config = [] ) {
		// Parent constructor
		parent::__construct( $config );

		// Traits
		$this->initializeIndicatorElement(
			array_merge( $config, [ 'indicatorElement' => $this ] ) );
		$this->initializeTitledElement(
			array_merge( $config, [ 'titled' => $this ] ) );
		$this->initializeLabelElement(
			array_merge( $config, [ 'labelElement' => $this, 'invisibleLabel' => true ] ) );

		// Initialization
		$this->addClasses( [ 'oo-ui-indicatorWidget' ] );
		// Remove class added by LabelElement initialization. It causes unexpected CSS to apply when
		// nested in other widgets, because this widget used to not mix in LabelElement.
		$this->removeClasses( [ 'oo-ui-labelElement-label' ] );
	}
}
