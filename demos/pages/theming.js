Demo.static.pages.theming = function(demo) {
	function header(text) {
		return $('<h1 class="theming-header">').text(text);
	}

	function colorBoxes(colorsNames) {
		return colorsNames.map(color => {
			var colorUsage;

			if (color.usage) {
				colorUsage = $('<div class="color-usage">').append(
					$('<h3>').text('Where to use it?'),
					$('<ul>').append(color.usage.map(item => $('<li>').html(item))),
				);
			}

			return $('<div class="color-box ' + color.name + '">').append(
				$('<label>')
					.append($('<span class="variable-name">').text('@' + color.name))
					.append($('<small>').html(color.desc)),
				colorUsage,
			);
		});
	}

	const selector = new OO.ui.ButtonSelectWidget({
		items: [
			new OO.ui.ButtonOptionWidget({
				label: 'Light theme',
				selected: true,
			}),
			new OO.ui.ButtonOptionWidget({
				label: 'Dark theme',
				selected: false,
			}),
			new OO.ui.ButtonOptionWidget({
				label: 'Light theme (very light background)',
				selected: false,
			}),
		],
	});

	const baseColors = colorBoxes([
		{ name: 'themed-page-background', desc: 'set in ThemeDesigner ($color-page)' },
		{ name: 'themed-link-color', desc: 'set in ThemeDesigner ($color-links)' },
		{ name: 'themed-button-background', desc: 'set in ThemeDesigner ($color-buttons)' },
	]);

	const booleanVariables = colorBoxes([
		{ name: 'is-dark-theme', desc: 'true if relative luminance (brightness) of @themed-page-background is below 50%' },
		{ name: 'is-very-light-theme', desc: 'true if lightness of @themed-page-background is greater than 90%' },
		{ name: 'is-dark-link', desc: 'true if relative luminance (brightness) of @themed-link-color is below 50%' },
		{
			name: 'is-dark-button',
			desc: 'true if relative luminance (brightness) of @themed-button-background is below 50%',
		},
	]);

	const backgroundColors = colorBoxes([
		{
			name: 'themed-page-background',
			desc: 'formerly: $color-page (basic color set in ThemeDesigner)',
			usage: ['base background color for articles and other content'],
		},
		{
			name: 'themed-page-background--secondary',
			desc:
				'light themes: mix of 95% @themed-page-background / 5% black<br>dark themes: mix of 85% @themed-page-background / 15% white<br>very light themes (@themed-page-background lightness > 90%): white',
			usage: [
				'background color for various windows, such as popups, dialogs, dropdowns, etc.',
				'for elements inside main content that need to stand&nbsp;out, i.e. tables',
			],
		},
	]);

	const textColors = colorBoxes([
		{
			name: 'themed-text-color',
			desc: 'light themes: @text-color--light #e6e6e6<br>dark themes: @text-color--dark #3a3a3a',
			usage: ['as base text color', 'color for secondary buttons and for text buttons'],
		},
		{
			name: 'themed-text-color--hover',
			desc: 'light themes: @themed-text-color lightened by 20%<br>dark themes: @themed-text-color darkened by 20%',
			usage: ['when there is some hoverable text (i.e. secondary buttons, text buttons)'],
		},
		{
			name: 'themed-text-color--secondary',
			desc: '@themed-text-color at 60% opacity',
			usage: ['for text that is less important'],
		},
	]);

	const linkColors = colorBoxes([
		{
			name: 'themed-link-color',
			desc: 'formerly: $color-links (basic color set in ThemeDesigner)',
			usage: [
				'everywhere as accent color',
				'links color',
				'various widgets accent color, i.e. tags, toggles, tabs, radio, checkboxes',
			],
		},
		{
			name: 'themed-link-color--hover',
			desc:
				'light @themed-link-color: @themed-link-color darkened by 20%<br>dark @themed-link-color: @themed-link-color lightened by 20%',
			usage: ['hover color for elements colored with @themed-link-color'],
		},
		{
			name: 'themed-link-color--fadeout',
			desc: '@themed-link-color at 15% opacity',
			usage: ['background for hovered items colored with @themed-link-color, i.e. tools in toolbar, drodowns, etc.'],
		},
		{
			name: 'themed-link-color--active',
			desc: '@themed-link-color--fadeout darkened by 20%',
			usage: ['color for active (selected) items, i.e. selected options in dropdowns, selected tool in toolbar'],
		},
		{
			name: 'themed-link--label',
			desc: 'light @themed-link-color: @wds-fandom-color-black<br>dark @themed-link-color: white',
			usage: ['text color for elements with background set to @themed-link-color, i.e. TabSelectWidget (framed)'],
		},
	]);

	const buttonColors = colorBoxes([
		{
			name: 'themed-button-background',
			desc: 'formerly: $color-buttons (basic color set in ThemeDesigner)',
			usage: ['for solid buttons, such as primary buttons'],
		},
		{
			name: 'themed-button-background--hover',
			desc:
				'light @themed-button-background: @themed-button-background darkened by 20%<br>dark @themed-button-background: @themed-button-background lightened by 20%',
			usage: ['hover color for elements colored with @themed-button-background'],
		},
		{
			name: 'themed-button-label',
			desc: 'light @themed-button-background: @wds-fandom-color-black<br>dark @themed-button-background: white',
			usage: ['text color for buttons with background set to @themed-button-background'],
		},
	]);

	const borderColors = colorBoxes([
		{
			name: 'themed-border-color',
			desc:
				'light themes: mix of 75% @themed-page-background and 25% black<br>dark themes: mix of 50% @themed-page-background and 50% white',
			usage: ['border color everywhere - tables, separators, borders for containers, etc. '],
		},
	]);

	const otherColors = colorBoxes([
		{
			name: 'themed-overlay-color',
			desc: 'light themes: black at 50% opacity<br>dark themes: white at 50% opacity',
			usage: ['color for overlaying curtains, that need to be transparent']
		},
		{ name: 'themed-window-box-shadow', desc: '0 3px 12px 0 rgba(0, 0, 0, 0.3)', usage: ['shadow for windows, such as popups, dialogs, etc.']},
	]);

	const toolbarColors = colorBoxes([
		{ name: 'toolbar-text-color', desc: 'light themes: @wds-fandom-color-black<br>dark themes: white' },
		{
			name: 'toolbar-separator-color',
			desc:
				'light themes: mix of 50% @themed-page-background and 50% black<br>dark themes: mix of 50% @themed-page-background and 50% white',
		},
	]);

	var sections = [
		{ header: 'Base colors', content: baseColors },
		{ header: 'Boolean variables', content: booleanVariables },
		{ header: 'Background colors', content: backgroundColors },
		{ header: 'Text colors', content: textColors },
		{ header: 'Link colors', content: linkColors },
		{ header: 'Button colors', content: buttonColors },
		{ header: 'Border colors', content: borderColors },
		{ header: 'Other colors', content: otherColors },
		{ header: 'Toolbar colors', content: toolbarColors },
	];

	sections = sections.map(section =>
		$('<section class="' + section.header.toLowerCase().replace(' ', '-') + '">').append(
			header(section.header),
			section.content,
		),
	);

	demo.$element.append(
		new OO.ui.PanelLayout({
			expanded: false,
			framed: true,
		}).$element
			.addClass('demo-container demo-theming')
			.attr('role', 'main')
			.append(selector.$element, sections),
	);
};
