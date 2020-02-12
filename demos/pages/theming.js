Demo.static.pages.theming = function(demo) {
	function header(text) {
		return $('<h1 class="theming-header">').text(text);
	}

	function colorBoxes(colorsNames) {
		return colorsNames.map(color =>
			$('<div class="color-box ' + color.name + '">').append(
				$('<label>')
					.append($('<span class="variable-name">').text('@' + color.name))
					.append($('<small>').html(color.desc)),
			),
		);
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
		{ name: 'themed-page-background' },
		{ name: 'themed-link-color' },
		{ name: 'themed-button-background' },
	]);

	const baseVariables = colorBoxes([
		{ name: 'is-dark-theme', desc: 'true if relative luminance (brightness) of @themed-page-background is below 50%' },
		{ name: 'is-dark-link', desc: 'true if relative luminance (brightness) of @themed-link-color is below 50%' },
		{ name: 'is-dark-button', desc: 'true if relative luminance (brightness) of @themed-button-background is below 50%' },
	]);

	const backgroundColors = colorBoxes([
		{ name: 'themed-page-background', desc: 'formerly: $color-page (basic color set in ThemeDesigner)' },
		{
			name: 'themed-page-background--secondary',
			desc:
				'light themes: mix of 95% @themed-page-background / 5% black<br>dark themes: mix of 85% @themed-page-background / 15% white<br>very light themes (@themed-page-background lightness > 90%): white',
		},
	]);

	const textColors = colorBoxes([
		{
			name: 'themed-text-color',
			desc: 'light themes: @text-color--light #e6e6e6<br>dark themes: @text-color--dark #3a3a3a',
		},
		{
			name: 'themed-text-color--hover',
			desc: 'light themes: @themed-text-color lightened by 20%<br>dark themes: @themed-text-color darkened by 20%',
		},
		{ name: 'themed-text-color--secondary', desc: '@themed-text-color at 60% opacity' },
	]);

	const linkColors = colorBoxes([
		{ name: 'themed-link-color', desc: 'formerly: $color-links (basic color set in ThemeDesigner)' },
		{
			name: 'themed-link-color--hover',
			desc:
				'light @themed-link-color: @themed-link-color darkened by 20%<br>dark @themed-link-color: @themed-link-color lightened by 20%',
		},
		{ name: 'themed-link-color--fadeout', desc: '@themed-link-color at 15% opacity' },
		{ name: 'themed-link-color--active', desc: '@themed-link-color--fadeout darkened by 20%' },
		{
			name: 'themed-link--label',
			desc: 'light @themed-link-color: @wds-fandom-color-black<br>dark @themed-link-color: white',
		},
	]);

	const buttonColors = colorBoxes([
		{ name: 'themed-button-background', desc: 'formerly: $color-buttons (basic color set in ThemeDesigner)' },
		{
			name: 'themed-button-background--hover',
			desc:
				'light @themed-button-background: @themed-button-background darkened by 20%<br>dark @themed-button-background: @themed-button-background lightened by 20%',
		},
		{
			name: 'themed-button-label',
			desc: 'light @themed-button-background: @wds-fandom-color-black<br>dark @themed-button-background: white',
		},
	]);

	const borderColors = colorBoxes([
		{
			name: 'themed-border-color',
			desc:
				'light themes: mix of 80% @themed-page-background and 20% black<br>dark themes: mix of 70@ @themed-page-background and 30% white',
		},
	]);

	const specialColors = colorBoxes([
		{ name: 'themed-alert-color', desc: '' },
		{ name: 'themed-alert-color--label', desc: '' },
		{ name: 'themed-alert-color--fadeout', desc: '' },
		{ name: 'themed-alert-color--active', desc: '' },
		{ name: 'themed-success-color', desc: '' },
		{ name: 'themed-warning-color', desc: '' },
		{ name: 'themed-notice-color', desc: '' },
	]);

	const otherColors = colorBoxes([
		{
			name: 'themed-overlay-color',
			desc: 'light themes: black at 50% opacity<br>dark themes: white at 50% opacity',
		},
		{ name: 'themed-window-box-shadow', desc: '0 3px 12px 0 rgba(0, 0, 0, 0.3)' },
	]);

	const toolbarColors = colorBoxes([
		{ name: 'toolbar-text-color', desc: 'light themes: @wds-fandom-color-black<br>dark themes: white', },
		{ name: 'toolbar-separator-color', desc: 'light themes: mix of 50% @themed-page-background and 50% black<br>dark themes: mix of 50% @themed-page-background and 50% white' },
	]);

	var sections = [
		{ header: 'Base colors', content: baseColors },
		{ header: 'Base variables', content: baseVariables },
		{ header: 'Background colors', content: backgroundColors },
		{ header: 'Text colors', content: textColors },
		{ header: 'Link colors', content: linkColors },
		{ header: 'Button colors', content: buttonColors },
		{ header: 'Border colors', content: borderColors },
		{ header: 'Special colors', content: specialColors },
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
