<?php

namespace OOUI;

/**
 * Input widget with a text field.
 */
class MultilineTextInputWidget extends TextInputWidget {

	/**
	 * Allow multiple lines of text.
	 *
	 * @var boolean
	 */
	protected $multiline = true;

	/**
	 * @param array $config Configuration options
	 * @param string $config['placeholder'] Placeholder text
	 * @param bool $config['autofocus'] Ask the browser to focus this widget, using the 'autofocus'
	 *   HTML attribute (default: false)
	 * @param bool $config['readOnly'] Prevent changes (default: false)
	 * @param number $config['maxLength'] Maximum allowed number of characters to input
	 * @param int $config['rows'] If multiline, number of visible lines in textarea
	 * @param bool $config['required'] Mark the field as required.
	 *   Implies `indicator: 'required'`. Note that `false` & setting `indicator: 'required'
	 *   will result in no indicator shown. (default: false)
	 */
	public function __construct( array $config = [] ) {
		// Config initialization
		$config = array_merge( [
			'readOnly' => false,
			'autofocus' => false,
			'required' => false,
			'multiline' => true,
		], $config );

		// Parent constructor
		parent::__construct( $config );
	}

	/**
	 * Check if input supports multiple lines.
	 *
	 * @return bool
	 */
	public function isMultiline() {
		return true;
	}
}
