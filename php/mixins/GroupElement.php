<?php

namespace OOUI;

/**
 * Element containing a sequence of child elements.
 *
 * @abstract
 */
class GroupElement extends ElementMixin {
	/**
	 * List of items in the group as Elements.
	 *
	 * @var array
	 */
	protected $items = [];

	public static $targetPropertyName = 'group';

	/**
	 * @param Element $element Element being mixed into
	 * @param array $config Configuration options
	 */
	public function __construct( Element $element, array $config = [] ) {
		// Parent constructor
		$target = isset( $config['group'] ) ? $config['group'] : new Tag( 'div' );
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
	 * @return Element[] Items
	 */
	public function getItems() {
		return $this->items;
	}

	/**
	 * Add items.
	 *
	 * Adding an existing item will move it.
	 *
	 * @param Element[] $items Items
	 * @param number $index Index to insert items at
	 * @return $this
	 */
	public function addItems( array $items, $index = null ) {
		foreach ( $items as $item ) {
			// Check if item exists then remove it first, effectively "moving" it
			$currentIndex = array_search( $item, $this->items );
			if ( $currentIndex !== false ) {
				$this->removeItems( [ $item ] );
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
		$this->target->appendContent( $this->items );

		return $this;
	}

	/**
	 * Remove items.
	 *
	 * @param Element[] $items Items to remove
	 * @return $this
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
		$this->target->appendContent( $this->items );

		return $this;
	}

	/**
	 * Clear all items.
	 *
	 * Items will be detached, not removed, so they can be used later.
	 *
	 * @return $this
	 */
	public function clearItems() {
		foreach ( $this->items as $item ) {
			$item->setElementGroup( null );
		}

		$this->items = [];
		$this->target->clearContent();

		return $this;
	}

	public function getConfig( &$config ) {
		$config['items'] = $this->items;
		return parent::getConfig( $config );
	}
}
