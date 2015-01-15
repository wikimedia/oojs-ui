OO.ui.Demo.static.pages.widgets = function ( demo ) {
	var fieldset, fieldLayouts,
		$demo = demo.$element;

	/**
	 * Draggable group widget containing drag/drop items
	 * @param {Object} [config] Configuration options
	 */
	function DragDropGroupWidget( config ) {
		// Configuration initialization
		config = config || {};

		// Parent constructor
		DragDropGroupWidget.super.call( this, config );

		// Mixin constructors
		OO.ui.DraggableGroupElement.call( this, $.extend( {}, config, { $group: this.$element } ) );

		// Respond to reorder event
		this.connect( this, { reorder: 'onReorder' } );
	}
	/* Setup */
	OO.inheritClass( DragDropGroupWidget, OO.ui.Widget );
	OO.mixinClass( DragDropGroupWidget, OO.ui.DraggableGroupElement );

	/**
	 * Respond to order event
	 * @param {OO.ui.DraggableElement} item Reordered item
	 * @param {number} newIndex New index
	 */
	DragDropGroupWidget.prototype.onReorder = function ( item, newIndex ) {
		this.addItems( [ item ], newIndex );
	};

	/**
	 * Drag/drop items
	 * @param {Object} [config] Configuration options
	 */
	function DragDropItemWidget( config ) {
		// Configuration initialization
		config = config || {};

		// Parent constructor
		DragDropItemWidget.super.call( this, config );

		// Mixin constructors
		OO.ui.DraggableElement.call( this, config );
	}
	/* Setup */
	OO.inheritClass( DragDropItemWidget, OO.ui.OptionWidget );
	OO.mixinClass( DragDropItemWidget, OO.ui.DraggableElement );

	fieldLayouts = [
		new OO.ui.FieldLayout(
			new OO.ui.IconWidget( {
				icon: 'picture',
				title: 'Picture icon'
			} ),
			{
				label: 'IconWidget (normal)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.IconWidget( {
				icon: 'picture',
				title: 'Picture icon',
				disabled: true
			} ),
			{
				label: 'IconWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.IndicatorWidget( {
				indicator: 'required',
				title: 'Required icon'
			} ),
			{
				label: 'IndicatorWidget (normal)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.IndicatorWidget( {
				indicator: 'required',
				title: 'Required icon',
				disabled: true
			} ),
			{
				label: 'IndicatorWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( { label: 'Normal' } ),
			{
				label: 'ButtonWidget (normal)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Progressive',
				flags: [ 'progressive' ]
			} ),
			{
				label: 'ButtonWidget (progressive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Constructive',
				flags: [ 'constructive' ]
			} ),
			{
				label: 'ButtonWidget (constructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Destructive',
				flags: [ 'destructive' ]
			} ),
			{
				label: 'ButtonWidget (destructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Primary progressive',
				flags: [ 'primary', 'progressive' ]
			} ),
			{
				label: 'ButtonWidget (primary, progressive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Primary constructive',
				flags: [ 'primary', 'constructive' ]
			} ),
			{
				label: 'ButtonWidget (primary, constructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Primary destructive',
				flags: [ 'primary', 'destructive' ]
			} ),
			{
				label: 'ButtonWidget (primary, destructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Disabled',
				disabled: true
			} ),
			{
				label: 'ButtonWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Constructive',
				flags: [ 'constructive' ],
				disabled: true
			} ),
			{
				label: 'ButtonWidget (constructive, disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Constructive',
				icon: 'picture',
				flags: [ 'constructive' ],
				disabled: true
			} ),
			{
				label: 'ButtonWidget (constructive, icon, disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Icon',
				icon: 'picture'
			} ),
			{
				label: 'ButtonWidget (icon)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Icon',
				icon: 'picture',
				flags: [ 'progressive' ]
			} ),
			{
				label: 'ButtonWidget (icon, progressive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Indicator',
				indicator: 'down'
			} ),
			{
				label: 'ButtonWidget (indicator)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Indicator',
				indicator: 'down',
				flags: [ 'constructive' ]
			} ),
			{
				label: 'ButtonWidget (indicator, constructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				icon: 'help',
				title: 'Icon only'
			} ),
			{
				label: 'ButtonWidget (icon only)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				icon: 'picture',
				label: 'Labeled'
			} ),
			{
				label: 'ButtonWidget (frameless)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				flags: [ 'progressive' ],
				icon: 'check',
				label: 'Progressive'
			} ),
			{
				label: 'ButtonWidget (frameless, progressive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				flags: [ 'destructive' ],
				icon: 'remove',
				label: 'Destructive'
			} ),
			{
				label: 'ButtonWidget (frameless, destructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				flags: [ 'constructive' ],
				icon: 'add',
				label: 'Constructive'
			} ),
			{
				label: 'ButtonWidget (frameless, constructive)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				icon: 'picture',
				label: 'Disabled',
				disabled: true
			} ),
			{
				label: 'ButtonWidget (frameless, disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				framed: false,
				flags: [ 'constructive' ],
				icon: 'picture',
				label: 'Constructive',
				disabled: true
			} ),
			{
				label: 'ButtonWidget (frameless, constructive, disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.PopupButtonWidget( {
				icon: 'info',
				framed: false,
				popup: {
					head: true,
					label: 'More information',
					$content: $( '<p>Extra information here.</p>' ),
					padded: true,
					align: 'left'
				}
			} ),
			{
				label: 'PopupButtonWidget (frameless, with popup head)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.PopupButtonWidget( {
				icon: 'menu',
				label: 'Options',
				popup: {
					$content: $( '<p>Additional options here.</p>' ),
					padded: true,
					align: 'left'
				}
			} ),
			{
				label: 'PopupButtonWidget (framed, no popup head)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new DragDropGroupWidget( {
				orientation: 'horizontal',
				items: [
					new DragDropItemWidget( {
						$: this.$,
						data: 'item1',
						label: 'Item 1'
					} ),
					new DragDropItemWidget( {
						$: this.$,
						data: 'item2',
						label: 'Item 2'
					} ),
					new DragDropItemWidget( {
						$: this.$,
						data: 'item3',
						label: 'Item 3'
					} ),
					new DragDropItemWidget( {
						$: this.$,
						data: 'item4',
						label: 'Item 4'
					} )
				]
			} ),
			{
				label: 'DraggableGroupWidget (horizontal)',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new DragDropGroupWidget( {
				items: [
					new DragDropItemWidget( {
						$: this.$,
						data: 'item1',
						label: 'Item 1'
					} ),
					new DragDropItemWidget( {
						$: this.$,
						data: 'item2',
						label: 'Item 2'
					} ),
					new DragDropItemWidget( {
						$: this.$,
						data: 'item3',
						label: 'Item 3'
					} ),
					new DragDropItemWidget( {
						$: this.$,
						data: 'item4',
						label: 'Item 4'
					} )
				]
			} ),
			{
				label: 'DraggableGroupWidget (vertical)',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonGroupWidget( {
				items: [
					new OO.ui.ButtonWidget( { icon: 'picture', indicator: 'down' } ),
					new OO.ui.ToggleButtonWidget( {
						label: 'One',
						flags: [ 'progressive' ]
					} ),
					new OO.ui.ToggleButtonWidget( {
						label: 'Two',
						flags: [ 'constructive' ]
					} ),
					new OO.ui.ToggleButtonWidget( {
						label: 'Three',
						flags: [ 'destructive' ]
					} )
				]
			} ),
			{
				label: 'ButtonGroupWidget',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonSelectWidget( {
				items: [
					new OO.ui.ButtonOptionWidget( {
						data: 'a',
						icon: 'picture',
						indicator: 'down'
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 'b',
						label: 'One',
						flags: [ 'progressive' ]
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 'c',
						label: 'Two',
						flags: [ 'constructive' ]
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 'd',
						label: 'Three',
						flags: [ 'destructive' ]
					} )
				]
			} ),
			{
				label: 'ButtonSelectWidget',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonSelectWidget( {
				disabled: true,
				items: [
					new OO.ui.ButtonOptionWidget( {
						data: 'a',
						icon: 'picture', indicator: 'down'
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 1,
						label: 'One'
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 2,
						label: 'Two'
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 3,
						label: 'Three'
					} )
				]
			} ),
			{
				label: 'ButtonSelectWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonSelectWidget( {
				items: [
					new OO.ui.ButtonOptionWidget( {
						data: 'a',
						icon: 'picture', indicator: 'down'
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 1,
						label: 'One',
						disabled: true
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 2,
						label: 'Two'
					} ),
					new OO.ui.ButtonOptionWidget( {
						data: 3,
						label: 'Three',
						disabled: true
					} )
				]
			} ),
			{
				label: 'ButtonSelectWidget (disabled items)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ToggleButtonWidget( { label: 'Toggle' } ),
			{
				label: 'ToggleButtonWidget',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ToggleButtonWidget( { label: 'Toggle', value: true } ),
			{
				label: 'ToggleButtonWidget (initially active)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ToggleButtonWidget( { icon: 'next' } ),
			{
				label: 'ToggleButtonWidget (icon only)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ToggleSwitchWidget(),
			{
				label: 'ToggleSwitchWidget',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ToggleSwitchWidget( { disabled: true } ),
			{
				label: 'ToggleSwitchWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ToggleSwitchWidget( { disabled: true, value: true } ),
			{
				label: 'ToggleSwitchWidget (disabled, checked)\u200E',
				align: 'top'
			}
		),
		new OO.ui.ActionFieldLayout(
			new OO.ui.TextInputWidget( {} ),
			new OO.ui.ButtonWidget( {
				label: 'Button'
			} ),
			{
				label: 'ActionFieldLayout aligned left',
				align: 'left'
			}
		),
		new OO.ui.ActionFieldLayout(
			new OO.ui.TextInputWidget( {} ),
			new OO.ui.ButtonWidget( {
				label: 'Button'
			} ),
			{
				label: 'ActionFieldLayout aligned inline',
				align: 'inline'
			}
		),
		new OO.ui.ActionFieldLayout(
			new OO.ui.TextInputWidget( {} ),
			new OO.ui.ButtonWidget( {
				label: 'Button'
			} ),
			{
				label: 'ActionFieldLayout aligned right',
				align: 'right'
			}
		),
		new OO.ui.ActionFieldLayout(
			new OO.ui.TextInputWidget( {} ),
			new OO.ui.ButtonWidget( {
				label: 'Button'
			} ),
			{
				label: 'ActionFieldLayout aligned top',
				align: 'top'
			}
		),
		new OO.ui.ActionFieldLayout(
			new OO.ui.TextInputWidget( {} ),
			new OO.ui.ButtonWidget( {
				label: 'Button'
			} ),
			{
				label: 'ActionFieldLayout aligned top with help',
				help: 'I am an additional, helpful information. Lorem ipsum dolor sit amet, cibo definiebas pri ' +
					'in, duo ex inimicus perpetua complectitur, mel periculis similique at.\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonWidget( {
				label: 'Button'
			} ),
			{
				label: 'FieldLayout with help',
				help: 'I am an additional, helpful information. Lorem ipsum dolor sit amet, cibo definiebas pri ' +
					'in, duo ex inimicus perpetua complectitur, mel periculis similique at.\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonInputWidget( {
				label: 'Submit the form',
				type: 'submit'
			} ),
			{
				align: 'top',
				label: 'ButtonInputWidget (type: submit)'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ButtonInputWidget( {
				label: 'Submit the form',
				type: 'submit',
				useInputTag: true
			} ),
			{
				align: 'top',
				label: 'ButtonInputWidget (type: submit, using <input/>)'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.CheckboxInputWidget( {
				selected: true
			} ),
			{
				align: 'inline',
				label: 'CheckboxInputWidget'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.CheckboxInputWidget( {
				selected: true,
				disabled: true
			} ),
			{
				align: 'inline',
				label: 'CheckboxInputWidget (disabled)\u200E'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.RadioInputWidget( {
				name: 'oojs-ui-radio-demo'
			} ),
			{
				align: 'inline',
				label: 'Connected RadioInputWidget #1'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.RadioInputWidget( {
				name: 'oojs-ui-radio-demo',
				selected: true
			} ),
			{
				align: 'inline',
				label: 'Connected RadioInputWidget #2'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.RadioSelectWidget( {
				items: [
					new OO.ui.RadioOptionWidget( {
						data: 'Cat',
						label: 'Cat'
					} ),
					new OO.ui.RadioOptionWidget( {
						data: 'Dog',
						label: 'Dog'
					} )
				]
			} ),
			{
				align: 'top',
				label: 'RadioSelectWidget'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.DropdownWidget( {
				label: 'Select one',
				align: 'top',
				menu: {
					items: [
						new OO.ui.MenuOptionWidget( {
							data: 'a',
							label: 'First'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'b',
							label: 'Second'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'c',
							label: 'Third'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'c',
							label: 'The fourth option has a long label'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'd',
							label: 'Fifth'
						} )
					]
				}
			} ),
			{
				label: 'DropdownWidget',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.DropdownWidget( {
				label: 'Select one',
				menu: {
					items: [
						new OO.ui.MenuOptionWidget( {
							data: 'a',
							label: 'First'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'b',
							label: 'Disabled second option',
							disabled: true
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'c',
							label: 'Third'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'd',
							label: 'Disabled fourth option with long label',
							disabled: true
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'c',
							label: 'Third'
						} )
					]
				}
			} ),
			{
				label: 'DropdownWidget (disabled options)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.DropdownWidget( {
				label: 'Select one',
				disabled: true,
				menu: {
					items: [
						new OO.ui.MenuOptionWidget( {
							data: 'a',
							label: 'First'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'b',
							label: 'Second'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'c',
							label: 'Third'
						} ),
						new OO.ui.MenuOptionWidget( {
							data: 'd',
							label: 'Fourth'
						} )
					]
				}
			} ),
			{
				label: 'DropdownWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ComboBoxWidget( {
				menu: {
					items: [
						new OO.ui.MenuOptionWidget( { data: 'asd', label: 'Label for asd' } ),
						new OO.ui.MenuOptionWidget( { data: 'fgh', label: 'Label for fgh' } ),
						new OO.ui.MenuOptionWidget( { data: 'jkl', label: 'Label for jkl' } ),
						new OO.ui.MenuOptionWidget( { data: 'zxc', label: 'Label for zxc' } ),
						new OO.ui.MenuOptionWidget( { data: 'vbn', label: 'Label for vbn' } )
					]
				}
			} ),
			{
				label: 'ComboBoxWidget',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ComboBoxWidget( {
				disabled: true,
				menu: {
					items: [
						new OO.ui.MenuOptionWidget( { data: 'asd', label: 'Label for asd' } ),
						new OO.ui.MenuOptionWidget( { data: 'fgh', label: 'Label for fgh' } ),
						new OO.ui.MenuOptionWidget( { data: 'jkl', label: 'Label for jkl' } ),
						new OO.ui.MenuOptionWidget( { data: 'zxc', label: 'Label for zxc' } ),
						new OO.ui.MenuOptionWidget( { data: 'vbn', label: 'Label for vbn' } )
					]
				}
			} ),
			{
				label: 'ComboBoxWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ComboBoxWidget(),
			{
				label: 'ComboBoxWidget (empty)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( { value: 'Text input' } ),
			{
				label: 'TextInputWidget\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( { icon: 'search' } ),
			{
				label: 'TextInputWidget (icon)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( { indicator: 'required' } ),
			{
				label: 'TextInputWidget (indicator)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( { placeholder: 'Placeholder' } ),
			{
				label: 'TextInputWidget (placeholder)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( {
				value: 'Readonly',
				readOnly: true
			} ),
			{
				label: 'TextInputWidget (readonly)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( {
				value: 'Disabled',
				disabled: true
			} ),
			{
				label: 'TextInputWidget (disabled)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( {
				multiline: true,
				value: 'Multiline'
			} ),
			{
				label: 'TextInputWidget (multiline)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.TextInputWidget( {
				multiline: true,
				autosize: true,
				value: 'Autosize'
			} ),
			{
				label: 'TextInputWidget (autosize)\u200E',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ProgressBarWidget( {
				progress: 33
			} ),
			{
				label: 'Progress bar',
				align: 'top'
			}
		),
		new OO.ui.FieldLayout(
			new OO.ui.ProgressBarWidget( {
				progress: false
			} ),
			{
				label: 'Progress bar (indeterminate)\u200E',
				align: 'top'
			}
		)
	];

	$.each( fieldLayouts, function ( i, fieldLayout ) {
		fieldLayout.$element.append(
			demo.buildConsole( fieldLayout.fieldWidget, 'widget' )
		);
	} );

	fieldset = new OO.ui.FieldsetLayout( { label: 'Widgets' } );
	fieldset.addItems( fieldLayouts );
	$demo.append( $( '<div class="oo-ui-demo-container">' ).append( fieldset.$element ) );
};

OO.ui.Demo.static.defaultPage = 'widgets';
