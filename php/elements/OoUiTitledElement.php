<?php

class OoUiTitledElement extends OoUiElementMixin {
	/**
	 * Title.
	 *
	 * @var string
	 */
	protected $title = null;

	public static $targetPropertyName = 'titled';

	/**
	 * Mixin titled element.
	 *
	 * If the 'title' config option is not provided, the static property '$title' of $element is used.
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['title'] Title
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		$target = isset( $config['titled'] ) ? $config['titled'] : $element;
		parent::__construct( $element, $target, $config );

		// Initialization
		$this->setTitle(
			isset( $config['title'] ) ? $config['title'] :
			( isset( $element::$title ) ? $element::$title : null )
		);
	}

	/**
	 * Add one or more flags.
	 *
	 * @param string|null Title text or null for no title
	 * @chainable
	 */
	public function setTitle( $title ) {
		if ( $this->title !== $title ) {
			if ( $title !== null ) {
				$this->target->setAttributes( array( 'title' => $title ) );
			} else {
				$this->target->removeAttributes( array( 'title' ) );
			}
		}

		return $this;
	}

	/**
	 * Get title.
	 *
	 * @return string Title string
	 */
	public function getTitle() {
		return $this->title;
	}
}
