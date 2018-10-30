<?php

namespace OOUI;

/**
 * Icon widget.
 *
 * See IconElement for more information.
 */
class IconWidget extends Widget {
	use IconElement;
	use TitledElement;
	use LabelElement;
	use FlaggedElement;

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
		$this->initializeIconElement(
			array_merge( $config, [ 'iconElement' => $this ] ) );
		$this->initializeTitledElement(
			array_merge( $config, [ 'titled' => $this ] ) );
		$this->initializeLabelElement(
			array_merge( $config, [ 'labelElement' => $this, 'invisibleLabel' => true ] ) );
		$this->initializeFlaggedElement( array_merge( $config, [ 'flagged' => $this ] ) );

		// Initialization
		$this->addClasses( [ 'oo-ui-iconWidget' ] );
		// Remove class added by LabelElement initialization. It causes unexpected CSS to apply when
		// nested in other widgets, because this widget used to not mix in LabelElement.
		$this->removeClasses( [ 'oo-ui-labelElement-label' ] );
	}
}
