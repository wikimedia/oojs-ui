<?php

/**
 * Element with a title.
 *
 * Titles are rendered by the browser and are made visible when hovering the element. Titles are
 * not visible on touch devices.
 */
class OoUiTitledElement extends OoUiElementMixin {
	/**
	 * Title text.
	 *
	 * @var string
	 */
	protected $title = null;

	public static $targetPropertyName = 'titled';

	/**
	 * 
	 *
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 * @param string $config['title'] Title. If not provided, the static property 'title' is used.
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
	 * Set title.
	 *
	 * @param string|null $title Title text or null for no title
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
