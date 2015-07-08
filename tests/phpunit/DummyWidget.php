<?php

namespace FooBarBaz;

use OOUI\Widget;

class MockWidget extends Widget {
	protected function getJavaScriptClassName() {
		return 'foo.bar.baz.MockWidget';
	}
}
