<?php

class OoUiElementMixin {

	/* Properties */

	/**
	 * Tag being targeted.
	 *
	 * @var OoUiTag
	 */
	public $target = null;

	/**
	 * Element being mixed into.
	 *
	 * @var OoUiElement
	 */
	protected $element = null;

	/**
	 * Property name for accessing the target on the element.
	 *
	 * @var string
	 */
	public static $targetPropertyName = '';

	/* Methods */

	/**
	 * Create element.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param OoUiTag $tag Tag being targeted
	 * @param array $config Configuration options
	 */
	public function __construct( OoUiElement $element, OoUiTag $target, array $config = array() ) {
		$this->element = $element;
		$this->target = $target;
	}
}
