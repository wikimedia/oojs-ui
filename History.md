# OOjs UI Release History

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
