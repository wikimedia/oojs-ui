<?php

/**
 * DOM element abstraction.
 */
class OoUiElement extends OoUiTag {

	/* Static properties */

	/**
	 * HTML tag name.
	 *
	 * This may be ignored if getTagName() is overridden.
	 *
	 * @var string
	 */
	public static $tagName = 'div';

	/**
	 * Default text direction, used for some layout calculations. Use setDefaultDir() to change.
	 *
	 * Currently only per-document directionality is supported.
	 *
	 * @var string
	 */
	public static $defaultDir = 'ltr';

	/* Members */

	/**
	 * Mixins.
	 *
	 * @var array List mixed in objects.
	 */
	protected $mixins = array();

	/* Methods */

	/**
	 * @param array $config Configuration options
	 * @param string[] $config['classes'] CSS class names to add
	 * @param array $config['content'] Content to append, strings or OoUiElement objects. Strings will
	 *   be HTML-escaped for output, use a OoUiHtmlSnippet instance to prevent that.
	 */
	public function __construct( array $config = array() ) {
		// Parent constructor
		parent::__construct( $this->getTagName() );

		// Initialization
		if ( isset( $config['classes'] ) && is_array( $config['classes'] ) ) {
			$this->addClasses( $config['classes'] );
		}
		if ( isset( $config['content'] ) ) {
			$this->appendContent( $config['content'] );
		}
	}

	/**
	 * Call a mixed-in method.
	 *
	 * This makes the methods of a mixin accessible through the element being mixed into.
	 *
	 * Triggers an error if the method is not found, as normal.
	 *
	 * @param string $method Method name
	 * @param array $arguments Method arguments
	 * @return mixed Result of method call
	 */
	public function __call( $method, $arguments ) {
		// Search mixins for methods
		foreach ( $this->mixins as $mixin ) {
			if ( method_exists( $mixin, $method ) ) {
				return call_user_func_array( array( $mixin, $method ), $arguments );
			}
		}
		// Fail normally
		trigger_error(
			'Call to undefined method ' . __CLASS__ . '::' . $method . '()',
			E_USER_ERROR
		);
	}

	/**
	 * Get a mixed-in target property.
	 *
	 * This makes the target of a mixin accessible through the element being mixed into.
	 *
	 * The target's property name is statically configured by the mixin class.
	 *
	 * Triggers a notice if the property is not found, as normal.
	 *
	 * @param string $name Property name
	 * @return OoUiTag|null Target property or null if not found
	 */
	public function __get( $name ) {
		// Search mixins for methods
		foreach ( $this->mixins as $mixin ) {
			if ( isset( $mixin::$targetPropertyName ) && $mixin::$targetPropertyName === $name ) {
				return $mixin->target;
			}
		}
		// Fail normally
		trigger_error( 'Undefined property: ' . $name, E_USER_NOTICE );
		return null;
	}

	/**
	 * Get the HTML tag name.
	 *
	 * Override this method to base the result on instance information.
	 *
	 * @return string HTML tag name
	 */
	public function getTagName() {
		return $this::$tagName;
	}

	/**
	 * Check if element supports one or more methods.
	 *
	 * @param string|string[] $methods Method or list of methods to check
	 * @return boolean All methods are supported
	 */
	public function supports( $methods ) {
		$support = 0;
		$methods = (array)$methods;

		foreach ( $methods as $method ) {
			if ( method_exists( $this, $method ) ) {
				$support++;
				continue;
			}

			// Search mixins for methods
			foreach ( $this->mixins as $mixin ) {
				if ( method_exists( $mixin, $method ) ) {
					$support++;
					break;
				}
			}
		}

		return count( $methods ) === $support;
	}

	/**
	 * Mixin a class.
	 *
	 * @param OoUiElementMixin $mixin Mixin object
	 */
	public function mixin( OoUiElementMixin $mixin ) {
		$this->mixins[] = $mixin;
	}

	/**
	 * Render element into HTML.
	 *
	 * @return string HTML serialization
	 */
	public function __toString() {
		OoUiTheme::singleton()->updateElementClasses( $this );
		return parent::__toString();
	}

	/**
	 * Get the direction of the user interface for a given element.
	 *
	 * Currently only per-document directionality is supported.
	 *
	 * @param OoUiTag $element Element to check
	 * @return string Text direction, either 'ltr' or 'rtl'
	 */
	public static function getDir( OoUiTag $element ) {
		return self::$defaultDir;
	}

	/**
	 * Set the default direction of the user interface.
	 *
	 * @return string Text direction, either 'ltr' or 'rtl'
	 */
	public static function setDefaultDir( $dir ) {
		self::$defaultDir = $dir === 'rtl' ? 'rtl' : 'ltr';
	}
}
