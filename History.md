# OOjs UI Release History

## v0.6.0 / 2014-12-16
* [BREAKING CHANGE] PopupToolGroup and friends: Pay off technical debt (Bartosz Dziewoński)
* ButtonGroupWidget: Remove weird margin-bottom: -1px; from theme styles (Bartosz Dziewoński)
* Prevent parent window scroll in modal mode using overflow hidden (Ed Sanders)
* MediaWiki theme: RadioInputWidget tweaks (Bartosz Dziewoński)
* ClippableElement: Handle clipping with left edge (Bartosz Dziewoński)
* Sprinkle some child selectors around in BookletLayout styles (Roan Kattouw)

## v0.5.0 / 2014-12-12
* [BREAKING CHANGE] FieldLayout: Handle 'inline' alignment better (Bartosz Dziewoński)
* [BREAKING CHANGE] Split primary flag into primary and progressive (Trevor Parscal)
* [BREAKING CHANGE] CheckboxInputWidget: Allow setting HTML 'value' attribute (Bartosz Dziewoński)
* MediaWiki theme: checkbox: Fix states according to spec (Prateek Saxena)
* MediaWiki theme: Add radio buttons (Prateek Saxena)
* MediaWiki theme: Use gray instead of blue for select and highlight (Trevor Parscal)
* MediaWiki theme: Copy .theme-oo-ui-outline{Controls,Option}Widget from Apex (Bartosz Dziewoński)
* MediaWiki theme: Add thematic border to the bottom of toolbars (Bartosz Dziewoński)
* MediaWiki theme: Extract @active-color variable (Bartosz Dziewoński)
* MediaWiki theme: Add hover state to listToolGroup (Trevor Parscal)
* MediaWiki theme: Add state transition to radio buttons (Prateek Saxena)
* MediaWiki theme: Make button sizes match Apex (Trevor Parscal)
* MediaWiki theme: Improve search widget styling (Trevor Parscal)
* build: Use String#slice instead of discouraged String#substr (Timo Tijhof)
* Element.getClosestScrollableContainer: Use 'body' or 'documentElement' based on browser (Prateek Saxena)
* testsuitegenerator: Actually filter out non-unique combinations (Bartosz Dziewoński)
* Fix primary button description text (Niklas Laxström)
* Give non-isolated windows a tabIndex for selection holding (Ed Sanders)
* Call .off() correctly in setButtonElement() (Roan Kattouw)
* RadioInputWidget: Remove documentation lies (Bartosz Dziewoński)
* Don't set line-height of unset button labels (Bartosz Dziewoński)
* Temporarily remove position:absolute on body when resizing (Ed Sanders)
* Kill the escape keydown event after handling a window close (Ed Sanders)
* PopupWidget: Remove box-shadow rule that generates invisible shadow (Bartosz Dziewoński)
* ClippableElement: 7 is a better number than 10 (Bartosz Dziewoński)
* FieldLayout: In styles, don't assume that label is given (Bartosz Dziewoński)
* TextInputWidget: Set vertical-align: middle, like buttons (Bartosz Dziewoński)
* FieldLayout: Synchronise PHP with JS (Bartosz Dziewoński)
* FieldLayout: Use <label> for this.$body, not this.$element (Bartosz Dziewoński)
* Account for <html> rather than <body> being the scrollable root in Chrome (Bartosz Dziewoński)
* GridLayout: Don't round to 1% (Bartosz Dziewoński)
* README.md: Drop localisation update auto-commits from release notes (James D. Forrester)
* README.md: Point to Phabricator, not Bugzilla (James D. Forrester)

## v0.4.0 / 2014-12-05
* [BREAKING CHANGE] Remove deprecated Element#onDOMEvent and #offDOMEvent (Bartosz Dziewoński)
* [BREAKING CHANGE] Make a number of Element getters static (Bartosz Dziewoński)
* [BREAKING CHANGE] Rename BookletLayout#getPageName → #getCurrentPageName (Bartosz Dziewoński)
* demo: Don't put buttons in a FieldsetLayout without FieldLayouts around them (Bartosz Dziewoński)
* IconElement: Add missing #getIconTitle (Bartosz Dziewoński)
* SelectWidget: Rewrite #getRelativeSelectableItem (Bartosz Dziewoński)
* Follow-up I859ff276e: Add cursor files to repo (Trevor Parscal)

## v0.3.0 / 2014-12-04
* [BREAKING CHANGE] ButtonWidget: Don't default 'target' to 'blank' (Bartosz Dziewoński)
* InputWidget: Update DOM value before firing 'change' event (Bartosz Dziewoński)
* TextInputWidget: Reuse a single clone instead of appending and removing new ones (Prateek Saxena)
* build: Have grunt watch run 'quick-build' instead of 'build' (Prateek Saxena)
* MediaWiki Theme: Reduce indentation in theme-oo-ui-checkboxInputWidget (Prateek Saxena)
* Adding DraggableGroupElement and DraggableElement mixins (Moriel Schottlender)
* Remove window even if closing promise rejects (Ed Sanders)
* Fix lies in documentation (Trevor Parscal)

## v0.2.4 / 2014-12-02
* TextInputWidget: Use .css( propertyName, value ) instead of .css( properties) for single property (Prateek Saxena)
* TextInputWidget: Stop adjustSize if the value of the textarea is the same (Prateek Saxena)
* Window: Avoid height flickering when resizing dialogs (Bartosz Dziewoński)
* MessageDialog: Fit actions again when the dialog is resized (Bartosz Dziewoński)

## v0.2.3 / 2014-11-26
* Dialog: Only handle escape events when open (Alex Monk)
* Pass original event with TextInputWidget#enter (Ed Sanders)
* Add missing documentation to ToolFactory (Ed Sanders)
* BookletLayout: Make #focus not crash when there are zero pages or when there is no outline (Roan Kattouw)
* Window: Disable transitions when changing window height to calculate content height (Bartosz Dziewoński)
* MessageDialog: Add Firefox hack for scrollbars when sizing dialogs (Bartosz Dziewoński)
* Fix RadioOptionWidget demos (Trevor Parscal)
* RadioOptionWidget: Remove lies from documentation (Trevor Parscal)
* RadioOptionWidget: Increase rule specificity to match OptionWidget (Bartosz Dziewoński)
* MessageDialog: Actually correctly calculate and set height (Bartosz Dziewoński)

## v0.2.2 / 2014-11-25
* LabelWidget: Add missing documentation for input configuration option (Ed Sanders)
* MessageDialog: Fit actions after updating window size, not before (Bartosz Dziewoński)
* MessageDialog: Use the right superclass (Bartosz Dziewoński)
* ProcessDialog, MessageDialog: Support iconed actions (Bartosz Dziewoński)
* Remove padding from undecorated option widgets (Ed Sanders)
* build: Add .npmignore (Timo Tijhof)

## v0.2.1 / 2014-11-24
* Start the window opening transition before ready, not after (Roan Kattouw)
* Add focus method to BookletLayout (Roan Kattouw)
* Add missing History.md file now we're a proper repo (James D. Forrester)
* README.md: Update introduction, badges, advice (James D. Forrester)
* LabelElement: Kill inline styles (Bartosz Dziewoński)
* composer: Rename package to 'oojs-ui' and require php 5.3.3 (Timo Tijhof)

## v0.2.0 / 2014-11-17
* First versioned release

## v0.1.0 / 2013-11-13
* Initial export of repo
