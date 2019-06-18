<?php

namespace Demo;

use OOUI;

class LinkedFieldsetLayout extends OOUI\FieldsetLayout {

	public function __construct( array $config = [] ) {
		$config = array_merge(
			[
				'labelElement' => ( new OOUI\Tag( 'a' ) )
					->setAttributes( [ 'href' => '#' . $config[ 'id' ] ] ),
			],
			$config
		);

		parent::__construct( $config );

		$this->addClasses( [ 'demo-linked-fieldset' ] );

		$this->removeAttributes( [ 'id' ] );
		$this->header->appendContent(
			( new OOUI\Tag( 'span' ) )
				->addClasses( [ 'demo-linked-fieldset-anchor' ] )
				->setAttributes( [ 'id' => $config[ 'id' ] ] )
		);
	}

	protected function getJavaScriptClassName() {
		return 'Demo.LinkedFieldsetLayout';
	}
}
