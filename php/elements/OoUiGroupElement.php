<?php

/**
 * Element containing a sequence of child elements.
 */
class OoUiGroupElement extends OoUiElementMixin {
	/**
	 * List of items in the group.
	 *
	 * @var OoUiElement[]
	 */
	protected $items = array();

	public static $targetPropertyName = 'group';

	/**
	 * @param OoUiElement $element Element being mixed into
	 * @param array $config Configuration options
	 */
	public function __construct( OoUiElement $element, array $config = array() ) {
		// Parent constructor
		$target = isset( $config['group'] ) ? $config['group'] : new OoUiTag( 'div' );
		parent::__construct( $element, $target, $config );
	}

	/**
	 * Check if there are no items.
	 *
	 * @return boolean Group is empty
	 */
	public function isEmpty() {
		return !count( $this->items );
	}

	/**
	 * Get items.
	 *
	 * @return OoUiElement[] Items
	 */
	public function getItems() {
		return $this->items;
	}

	/**
	 * Add items.
	 *
	 * Adding an existing item will move it.
	 *
	 * @param OoUiElement[] $items Items
	 * @param number $index Index to insert items at
	 * @chainable
	 */
	public function addItems( array $items, $index = null ) {
		foreach ( $items as $item ) {
			// Check if item exists then remove it first, effectively "moving" it
			$currentIndex = array_search( $item, $this->items );
			if ( $currentIndex !== false ) {
				$this->removeItems( array( $item ) );
				// Adjust index to compensate for removal
				if ( $currentIndex < $index ) {
					$index--;
				}
			}
			// Add the item
			$item->setElementGroup( $this );
		}

		if ( $index === null || $index < 0 || $index >= count( $this->items ) ) {
			$this->items = array_merge( $this->items, $items );
		} else {
			array_splice( $this->items, $index, 0, $items );
		}

		// Update actual target element contents to reflect our list
		$this->target->clearContent();
		call_user_func_array( array( $this->target, 'appendContent' ), $this->items );

		return $this;
	}

	/**
	 * Remove items.
	 *
	 * @param OoUiElement[] $items Items to remove
	 * @chainable
	 */
	public function removeItems( $items ) {
		foreach ( $items as $item ) {
			$index = array_search( $item, $this->items );
			if ( $index !== false ) {
				$item->setElementGroup( null );
				array_splice( $this->items, $index, 1 );
			}
		}

		// Update actual target element contents to reflect our list
		$this->target->clearContent();
		call_user_func_array( array( $this->target, 'appendContent' ), $this->items );

		return $this;
	}

	/**
	 * Clear all items.
	 *
	 * Items will be detached, not removed, so they can be used later.
	 *
	 * @chainable
	 */
	public function clearItems() {
		foreach ( $this->items as $item ) {
			$item->setElementGroup( null );
		}

		$this->items = array();
		$this->target->clearContent();

		return $this;
	}
}
