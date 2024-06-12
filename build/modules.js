/* eslint-disable quotes, quote-props, max-len */

'use strict';

module.exports = {
	// The core JavaScript library. This contains the widgets you're most likely to need in your
	// interfaces, including everything required to infuse any PHP widgets.
	"oojs-ui-core": {
		"scripts": [
			// Core of the core. The basic building block of Element, facilities to connect PHP and JS
			// widgets (infuse), some abstract classes, a bunch of convenience methods.
			"src/core.js",
			"dist/tmp/src/core-messages.js",
			"src/mixin.js",
			"src/Element.js",
			"src/HtmlSnippet.js",
			"src/Layout.js",
			"src/Widget.js",
			"src/Theme.js",

			// Basic element mixins. These should be the same classes that are supported in OOUI PHP.
			"src/mixins/TabIndexedElement.js",
			"src/mixins/ButtonElement.js",
			"src/mixins/GroupElement.js",
			"src/mixins/LabelElement.js",
			"src/mixins/IconElement.js",
			"src/mixins/IndicatorElement.js",
			"src/mixins/FlaggedElement.js",
			"src/mixins/TitledElement.js",
			"src/mixins/AccessKeyedElement.js",
			"src/mixins/RequiredElement.js",

			// The basic widgets and layouts. These should be the same classes that are supported in
			// OOUI PHP. (Continued below, as some dependencies below depend on these.)
			"src/widgets/ButtonWidget.js",
			"src/widgets/ButtonGroupWidget.js",
			"src/widgets/IconWidget.js",
			"src/widgets/IndicatorWidget.js",
			"src/widgets/LabelWidget.js",
			"src/widgets/MessageWidget.js",
			"src/widgets/ToggleWidget.js",
			"src/widgets/ToggleSwitchWidget.js",

			// The JavaScript-specific dependencies of the basic widgets. It's sad how many there are :(
			// TextInputWidget
			"src/mixins/PendingElement.js",
			// ComboBoxInputWidget, DropdownWidget, PopupWidget
			"src/mixins/FloatableElement.js",
			"src/mixins/ClippableElement.js",
			// FieldLayout, FieldsetLayout
			"src/widgets/PopupWidget.js",
			"src/mixins/PopupElement.js",
			"src/widgets/PopupButtonWidget.js",
			// DropdownInputWidget, RadioSelectInputWidget
			"src/mixins/GroupWidget.js",
			"src/mixins/ItemWidget.js",
			"src/widgets/OptionWidget.js",
			"src/widgets/SelectWidget.js",
			"src/widgets/DecoratedOptionWidget.js",
			// DropdownInputWidget
			"src/widgets/MenuOptionWidget.js",
			"src/widgets/MenuSectionOptionWidget.js",
			"src/widgets/MenuSelectWidget.js",
			"src/widgets/DropdownWidget.js",
			// RadioSelectInputWidget
			"src/widgets/RadioOptionWidget.js",
			"src/widgets/RadioSelectWidget.js",
			// CheckboxMultiselectInputWidget
			"src/widgets/MultioptionWidget.js",
			"src/widgets/MultiselectWidget.js",
			"src/widgets/CheckboxMultioptionWidget.js",
			"src/widgets/CheckboxMultiselectWidget.js",
			// ProgressBarWidget
			"src/widgets/ProgressBarWidget.js",

			// The basic widgets and layouts, continued.
			"src/widgets/InputWidget.js",
			"src/widgets/HiddenInputWidget.js",
			"src/widgets/ButtonInputWidget.js",
			"src/widgets/CheckboxInputWidget.js",
			"src/widgets/DropdownInputWidget.js",
			"src/widgets/RadioInputWidget.js",
			"src/widgets/RadioSelectInputWidget.js",
			"src/widgets/CheckboxMultiselectInputWidget.js",
			"src/widgets/TextInputWidget.js",
			"src/widgets/SearchInputWidget.js",
			"src/widgets/MultilineTextInputWidget.js",
			"src/widgets/ComboBoxInputWidget.js",
			"src/layouts/FieldLayout.js",
			"src/layouts/ActionFieldLayout.js",
			"src/layouts/FieldsetLayout.js",
			"src/layouts/FormLayout.js",
			"src/layouts/PanelLayout.js",
			"src/layouts/HorizontalLayout.js",
			"src/widgets/NumberInputWidget.js",
			"src/widgets/SelectFileInputWidget.js"
		]
	},
	// Additional widgets and layouts module. These have no equivalent in OOUI PHP.
	"oojs-ui-widgets": {
		"scripts": [
			"src/mixins/DraggableElement.js",
			"src/mixins/DraggableGroupElement.js",

			"src/mixins/RequestManager.js",
			"src/mixins/LookupElement.js",

			"src/layouts/TabPanelLayout.js",
			"src/layouts/PageLayout.js",
			"src/layouts/StackLayout.js",
			"src/layouts/MenuLayout.js",
			"src/layouts/BookletLayout.js",
			"src/layouts/IndexLayout.js",
			"src/layouts/CopyTextLayout.js",

			"src/widgets/ToggleButtonWidget.js",

			"src/widgets/OutlineControlsWidget.js",
			"src/widgets/OutlineOptionWidget.js",
			"src/widgets/OutlineSelectWidget.js",
			"src/widgets/ButtonOptionWidget.js",
			"src/widgets/ButtonSelectWidget.js",
			"src/widgets/TabOptionWidget.js",
			"src/widgets/TabSelectWidget.js",

			"src/widgets/ButtonMenuSelectWidget.js",

			"src/widgets/TagItemWidget.js",
			"src/widgets/TagMultiselectWidget.js",
			"src/widgets/PopupTagMultiselectWidget.js",
			"src/widgets/MenuTagMultiselectWidget.js",

			"src/widgets/SearchWidget.js"
		]
	},
	// Toolbar and tools module.
	"oojs-ui-toolbars": {
		"scripts": [
			"src/Toolbar.js",
			"src/Tool.js",
			"src/ToolGroup.js",
			"src/ToolFactory.js",
			"src/ToolGroupFactory.js",
			"src/tools/PopupTool.js",
			"src/tools/ToolGroupTool.js",
			"src/toolgroups/BarToolGroup.js",
			"src/toolgroups/PopupToolGroup.js",
			"src/toolgroups/ListToolGroup.js",
			"src/toolgroups/MenuToolGroup.js"
		]
	},
	// Windows and dialogs module.
	"oojs-ui-windows": {
		"scripts": [
			"src/widgets/ActionWidget.js",
			"src/ActionSet.js",
			"src/Error.js",
			"src/Process.js",
			"src/WindowInstance.js",
			"src/WindowManager.js",
			"src/Window.js",
			"src/Dialog.js",
			"src/dialogs/MessageDialog.js",
			"src/dialogs/ProcessDialog.js",
			"src/windows.js"
		]
	},

	// All styles, built per-theme, and theme-specific scripts.
	//
	// '{Theme}' expands to proper theme name: 'Apex' or 'WikimediaUI'.
	// '{theme}' expands to lowercase theme name: 'apex' or 'wikimediaui'.
	//
	// The .json files are first compiled to .less using the colorize-svg script.
	"oojs-ui-{theme}": {
		"scripts": [
			"src/themes/{theme}/{Theme}Theme.js"
		]
	},
	"oojs-ui-core-{theme}": {
		// This list is also used by .stylelintrc.js to apply 'support-basic' rules
		"styles": [
			"src/styles/Element.less",
			"src/styles/elements/ButtonElement.less",
			"src/styles/elements/ClippableElement.less",
			"src/styles/elements/FloatableElement.less",
			"src/styles/elements/FlaggedElement.less",
			"src/styles/elements/GroupElement.less",
			"src/styles/elements/LabelElement.less",
			"src/styles/elements/IconElement.less",
			"src/styles/elements/IndicatorElement.less",
			"src/styles/elements/PendingElement.less",
			"src/styles/elements/PopupElement.less",
			"src/styles/elements/TabIndexedElement.less",
			"src/styles/elements/TitledElement.less",

			"src/styles/Layout.less",
			"src/styles/layouts/FieldLayout.less",
			"src/styles/layouts/ActionFieldLayout.less",
			"src/styles/layouts/FieldsetLayout.less",
			"src/styles/layouts/FormLayout.less",
			"src/styles/layouts/PanelLayout.less",
			"src/styles/layouts/HorizontalLayout.less",

			"src/styles/Widget.less",
			"src/styles/widgets/SelectWidget.less",
			"src/styles/widgets/OptionWidget.less",
			"src/styles/widgets/DecoratedOptionWidget.less",
			"src/styles/widgets/RadioSelectWidget.less",
			"src/styles/widgets/RadioOptionWidget.less",
			"src/styles/widgets/LabelWidget.less",
			"src/styles/widgets/MessageWidget.less",
			"src/styles/widgets/IconWidget.less",
			"src/styles/widgets/IndicatorWidget.less",
			"src/styles/widgets/ButtonWidget.less",
			"src/styles/widgets/ButtonGroupWidget.less",
			"src/styles/widgets/PopupWidget.less",
			"src/styles/widgets/PopupButtonWidget.less",
			"src/styles/widgets/InputWidget.less",
			"src/styles/widgets/ButtonInputWidget.less",
			"src/styles/widgets/CheckboxInputWidget.less",
			"src/styles/widgets/CheckboxMultiselectInputWidget.less",
			"src/styles/widgets/DropdownInputWidget.less",
			"src/styles/widgets/RadioInputWidget.less",
			"src/styles/widgets/RadioSelectInputWidget.less",
			"src/styles/widgets/TextInputWidget.less",
			"src/styles/widgets/MenuSelectWidget.less",
			"src/styles/widgets/MenuOptionWidget.less",
			"src/styles/widgets/MenuSectionOptionWidget.less",
			"src/styles/widgets/DropdownWidget.less",
			"src/styles/widgets/ComboBoxInputWidget.less",
			"src/styles/widgets/MultiselectWidget.less",
			"src/styles/widgets/MultioptionWidget.less",
			"src/styles/widgets/CheckboxMultiselectWidget.less",
			"src/styles/widgets/CheckboxMultioptionWidget.less",
			"src/styles/widgets/ProgressBarWidget.less",
			"src/styles/widgets/NumberInputWidget.less",
			"src/styles/widgets/SelectFileInputWidget.less",
			"src/styles/widgets/ToggleWidget.less",
			"src/styles/widgets/ToggleSwitchWidget.less",
			"src/styles/core.less"
		]
	},
	"oojs-ui-widgets-{theme}": {
		"styles": [
			"src/styles/elements/DraggableElement.less",
			"src/styles/elements/DraggableGroupElement.less",
			"src/styles/elements/LookupElement.less",

			"src/styles/layouts/BookletLayout.less",
			"src/styles/layouts/IndexLayout.less",
			"src/styles/layouts/CopyTextLayout.less",
			"src/styles/layouts/MenuLayout.less",
			"src/styles/layouts/TabPanelLayout.less",
			"src/styles/layouts/PageLayout.less",
			"src/styles/layouts/StackLayout.less",

			"src/styles/widgets/ButtonSelectWidget.less",
			"src/styles/widgets/ButtonOptionWidget.less",
			"src/styles/widgets/ToggleButtonWidget.less",

			"src/styles/widgets/OutlineSelectWidget.less",
			"src/styles/widgets/OutlineOptionWidget.less",
			"src/styles/widgets/OutlineControlsWidget.less",

			"src/styles/widgets/TabSelectWidget.less",
			"src/styles/widgets/TabOptionWidget.less",

			"src/styles/widgets/ButtonMenuSelectWidget.less",

			"src/styles/widgets/TagMultiselectWidget.less",
			"src/styles/widgets/MenuTagMultiselectWidget.less",
			"src/styles/widgets/TagItemWidget.less",
			"src/styles/widgets/SearchWidget.less"
		]
	},
	"oojs-ui-toolbars-{theme}": {
		"styles": [
			"src/styles/Tool.less",
			"src/styles/tools/PopupTool.less",
			"src/styles/tools/ToolGroupTool.less",

			"src/styles/ToolGroup.less",
			"src/styles/toolgroups/BarToolGroup.less",
			"src/styles/toolgroups/PopupToolGroup.less",
			"src/styles/toolgroups/ListToolGroup.less",
			"src/styles/toolgroups/MenuToolGroup.less",

			"src/styles/Toolbar.less"
		]
	},
	"oojs-ui-windows-{theme}": {
		"styles": [
			"src/styles/widgets/ActionWidget.less",

			"src/styles/Window.less",
			"src/styles/Dialog.less",
			"src/styles/dialogs/MessageDialog.less",
			"src/styles/dialogs/ProcessDialog.less",

			"src/styles/WindowManager.less"
		]
	},

	// Image content. Generates oojs-ui-images-{theme}.css and so oojs-ui-{theme}.css files
	"oojs-ui-images-{theme}": {
		"styles": [
			"src/themes/{theme}/icons-movement.json",
			"src/themes/{theme}/icons-content.json",
			"src/themes/{theme}/icons-alerts.json",
			"src/themes/{theme}/icons-interactions.json",
			"src/themes/{theme}/icons-moderation.json",
			"src/themes/{theme}/icons-editing-core.json",
			"src/themes/{theme}/icons-editing-styling.json",
			"src/themes/{theme}/icons-editing-functions.json",
			"src/themes/{theme}/icons-editing-list.json",
			"src/themes/{theme}/icons-editing-advanced.json",
			"src/themes/{theme}/icons-editing-citation.json",
			"src/themes/{theme}/icons-media.json",
			"src/themes/{theme}/icons-location.json",
			"src/themes/{theme}/icons-user.json",
			"src/themes/{theme}/icons-layout.json",
			"src/themes/{theme}/icons-accessibility.json",
			"src/themes/{theme}/icons-wikimedia.json",
			"src/themes/{theme}/indicators.json"
		]
	},

	// Icon packs. Generates oojs-ui-{theme}-icons-{pack}.css files
	"oojs-ui-{theme}-icons-accessibility": {
		"styles": [
			"src/themes/{theme}/icons-accessibility.json"
		]
	},
	"oojs-ui-{theme}-icons-movement": {
		"styles": [
			"src/themes/{theme}/icons-movement.json"
		]
	},
	"oojs-ui-{theme}-icons-content": {
		"styles": [
			"src/themes/{theme}/icons-content.json"
		]
	},
	"oojs-ui-{theme}-icons-alerts": {
		"styles": [
			"src/themes/{theme}/icons-alerts.json"
		]
	},
	"oojs-ui-{theme}-icons-interactions": {
		"styles": [
			"src/themes/{theme}/icons-interactions.json"
		]
	},
	"oojs-ui-{theme}-icons-moderation": {
		"styles": [
			"src/themes/{theme}/icons-moderation.json"
		]
	},
	"oojs-ui-{theme}-icons-editing-core": {
		"styles": [
			"src/themes/{theme}/icons-editing-core.json"
		]
	},
	"oojs-ui-{theme}-icons-editing-styling": {
		"styles": [
			"src/themes/{theme}/icons-editing-styling.json"
		]
	},
	"oojs-ui-{theme}-icons-editing-functions": {
		"styles": [
			"src/themes/{theme}/icons-editing-functions.json"
		]
	},
	"oojs-ui-{theme}-icons-editing-list": {
		"styles": [
			"src/themes/{theme}/icons-editing-list.json"
		]
	},
	"oojs-ui-{theme}-icons-editing-advanced": {
		"styles": [
			"src/themes/{theme}/icons-editing-advanced.json"
		]
	},
	"oojs-ui-{theme}-icons-editing-citation": {
		"styles": [
			"src/themes/{theme}/icons-editing-citation.json"
		]
	},
	"oojs-ui-{theme}-icons-media": {
		"styles": [
			"src/themes/{theme}/icons-media.json"
		]
	},
	"oojs-ui-{theme}-icons-location": {
		"styles": [
			"src/themes/{theme}/icons-location.json"
		]
	},
	"oojs-ui-{theme}-icons-user": {
		"styles": [
			"src/themes/{theme}/icons-user.json"
		]
	},
	"oojs-ui-{theme}-icons-layout": {
		"styles": [
			"src/themes/{theme}/icons-layout.json"
		]
	},
	"oojs-ui-{theme}-icons-wikimedia": {
		"styles": [
			"src/themes/{theme}/icons-wikimedia.json"
		]
	}
};
