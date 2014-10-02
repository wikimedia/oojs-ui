<?php

class OoUiTag {

	/* Members */

	/**
	 * Tag name for this instance.
	 *
	 * @var string HTML tag name
	 */
	protected $tag = '';

	/**
	 * Attributes.
	 *
	 * @var array HTML attributes
	 */
	protected $attributes = array();

	/**
	 * Classes.
	 *
	 * @var array CSS classes
	 */
	protected $classes = array();

	/**
	 * Content.
	 *
	 * @var array Content text and elements
	 */
	protected $content = array();

	/* Methods */

	/**
	 * Create element.
	 *
	 * @param string $tag HTML tag name
	 */
	public function __construct( $tag = 'div' ) {
		$this->tag = $tag;
	}

	/**
	 * Check for CSS class.
	 *
	 * @param string $name CSS class name
	 * @return boolean
	 */
	public function hasClass( $class ) {
		return in_array( $class, $this->classes );
	}

	/**
	 * Add CSS classes.
	 *
	 * @param array $classes List of classes to add
	 * @chainable
	 */
	public function addClasses( array $classes ) {
		$this->classes = array_merge( $this->classes, $classes );
		return $this;
	}

	/**
	 * Remove CSS classes.
	 *
	 * @param array $classes List of classes to remove
	 * @chainable
	 */
	public function removeClasses( array $classes ) {
		$this->classes = array_diff( $this->classes, $classes );
		return $this;
	}

	/**
	 * Toggle CSS classes.
	 *
	 * @param array $classes List of classes to add
	 * @param boolean $toggle Add classes
	 * @chainable
	 */
	public function toggleClasses( array $classes, $toggle = null ) {
		if ( $toggle === null ) {
			$this->classes = array_diff(
				array_merge( $this->classes, $classes ),
				array_intersect( $this->classes, $classes )
			);
		} elseif ( $toggle ) {
			$this->classes = array_merge( $this->classes, $classes );
		} else {
			$this->classes = array_diff( $this->classes, $classes );
		}
		return $this;
	}

	/**
	 * Get HTML attribute value.
	 *
	 * @param string $key HTML attribute name
	 * @return string|null
	 */
	public function getAttribute( $key ) {
		return isset( $this->attributes[$key] ) ? $this->attributes[$key] : null;
	}

	/**
	 * Add HTML attributes.
	 *
	 * @param array $attributes List of attribute key/value pairs to add
	 * @chainable
	 */
	public function setAttributes( array $attributes ) {
		foreach ( $attributes as $key => $value ) {
			$this->attributes[$key] = $value;
		}
		return $this;
	}

	/**
	 * Remove HTML attributes.
	 *
	 * @param array $keys List of attribute keys to remove
	 * @chainable
	 */
	public function removeAttributes( array $keys ) {
		foreach ( $keys as $key ) {
			unset( $this->attributes[$key] );
		}
		return $this;
	}

	/**
	 * Add content to the end.
	 *
	 * @param string|array|Serializable One or more strings or serializable elements to append
	 * @chainable
	 */
	public function appendContent( /* $content... */ ) {
		$contents = func_get_args();
		$this->content = array_merge( $this->content, $contents );
		return $this;
	}

	/**
	 * Add content to the beginning.
	 *
	 * @param string|array|Serializable One or more strings or serializable elements to prepend
	 * @chainable
	 */
	public function prependContent( /* $content... */ ) {
		$contents = func_get_args();
		array_splice( $this->content, 0, 0, $contents );
		return $this;
	}

	/**
	 * Remove all content.
	 *
	 * @chainable
	 */
	public function clearContent() {
		$this->content = array();
		return $this;
	}

	/**
	 * Render element into HTML.
	 *
	 * @return string HTML serialization
	 */
	public function __toString() {
		// Attributes
		$attributes = '';
		foreach (
			array_merge(
				$this->attributes,
				array( 'class' => implode( ' ', array_unique( $this->classes ) ) )
			) as
			$key => $value
		) {
			$attributes .= ' ' . $key . '="' . htmlspecialchars( $value ) . '"';
		}

		// Content
		$content = '';
		foreach ( $this->content as $part ) {
			if ( is_string( $part ) || $part instanceof OoUiTag ) {
				$content .= (string)$part;
			}
		}

		// Tag
		return '<' . $this->tag . $attributes . '>' . $content . '</' . $this->tag . '>';
	}
}
