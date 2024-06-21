/* eslint-disable quotes, quote-props */

'use strict';

const modules = require( './build/modules' );

module.exports = {
	"extends": [
		"stylelint-config-wikimedia/support-modern"
	],
	"overrides": [
		{
			files: modules[ 'oojs-ui-core-{theme}' ].styles,
			extends: [
				"stylelint-config-wikimedia/support-basic"
			]
		},
		{
			"files": [
				"**/*.(less|css|html)"
			],
			"customSyntax": "postcss-less",
			"rules": {
				"block-no-empty": null,
				"no-descending-specificity": null,
				"@stylistic/block-closing-brace-space-after": null,
				"selector-class-pattern": "^(oo-ui|mw-tool)-"
			}
		}
	]
};
