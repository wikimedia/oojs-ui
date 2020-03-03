Demo.static.pages.theming = function(demo) {
	function header(text) {
		return $('<h1 class="theming-header">').html(text);
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

	const specialColors = colorBoxes([
		{
			name: 'themed-alert-color',
			desc: 'primarily set to @wds-color-alert',
			usage: ['buttons flagged as destructive', 'fields marked as invalid', 'error messages'],
		},
		{
			name: 'themed-success-color',
			desc: 'primarily set to @wds-color-success',
			usage: ['success messages'],
		},
		{
			name: 'themed-warning-color',
			desc: 'primarily set to @wds-color-warning',
			usage: ['warning messages'],
		},
		{
			name: 'themed-notice-color',
			desc: 'primarily set to @wds-color-message',
		},
	]);

	const specialColorsVariations = colorBoxes([
		{
			name: 'themed-alert-color--fadeout',
			desc: '@themed-alert-color at 15% opacity',
			usage: ['light background for invalid fields, tags, etc.'],
		},
		{
			name: 'themed-alert-color--hover',
			desc:
				'light @themed-alert-color: @themed-alert-color darkened by 20%<br>dark @themed-alert-color: @themed-alert-color lightened by 20%',
			usage: ['destructive buttons hover state'],
		},
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
				'light themes: mix of 95% @themed-page-background / 5% black<br>dark themes: mix of 85% @themed-page-background / 15% white',
			usage: ['for elements inside main content that need to stand&nbsp;out, i.e. tables'],
		},
		{
			name: 'themed-page-background--windows',
			desc:
				'very light themes (@themed-page-background lightness > 90%): white<br>all other (@themed-page-background lightness < 90%): @themed-page-background--secondary',
			usage: ['background color for various windows, such as popups, dialogs, dropdowns, etc.'],
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

	const labelColors = colorBoxes([
		{
			name: 'themed-link-label',
			desc: '@wds-fandom-color-black or white - depending on which one makes better contrast ratio with @themed-link-color',
			usage: ['text color for elements with background set to @themed-link-color, i.e. TabSelectWidget (framed)'],
		},
		{
			name: 'themed-button-label',
			desc: '@wds-fandom-color-black or white - depending on which one makes better contrast ratio with @themed-button-background',
			usage: ['text color for buttons with background set to @themed-button-background, i.e. primary buttons'],
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
			usage: ['color for overlaying curtains, that need to be transparent'],
		},
		{
			name: 'themed-window-box-shadow',
			desc: '0 3px 12px 0 rgba(0, 0, 0, 0.3)',
			usage: ['shadow for windows, such as popups, dialogs, etc.'],
		},
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
		{ header: 'Base colors <small>(set on Theme Designer)</small>', class: 'base-colors', content: baseColors },
		{
			header:
				'Special colors <small>(adjusted on UCP to meet 3.1:1 ratio with @themed-page-background for accessibility)</small>',
			class: 'special-colors',
			content: specialColors,
		},
		{ header: 'Special colors variations', class: 'special-colors-variations', content: specialColorsVariations },
		{ header: 'Boolean variables', class: 'boolean-variables', content: booleanVariables },
		{ header: 'Background colors', class: 'background-colors', content: backgroundColors },
		{ header: 'Text colors', class: 'text-colors', content: textColors },
		{ header: 'Label colors', class: 'label-colors', content: labelColors },
		{ header: 'Link colors', class: 'link-colors', content: linkColors },
		{ header: 'Button colors', class: 'button-colors', content: buttonColors },
		{ header: 'Border colors', class: 'border-colors', content: borderColors },
		{ header: 'Other colors', class: 'other-colors', content: otherColors },
		{ header: 'Toolbar colors', class: 'toolbar-colors', content: toolbarColors },
	];

	sections = sections.map(section =>
		$('<section class="' + section.class + '">').append(header(section.header), section.content),
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
