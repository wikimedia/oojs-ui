// This file temporarily contains the parts of OOUI that require ES6 syntax
// to implement, so that we can skip them when generating JSDuck documentation,
// because it can't parse it.

// Define a custom HTML element that does nothing except to expose the `connectedCallback` callback
// as `onConnectOOUI` property. We use it in some widgets to detect when they are connected.
if ( window.customElements ) {
	window.customElements.define( 'ooui-connect-detector', class extends HTMLElement {
		connectedCallback() {
			if ( this.onConnectOOUI instanceof Function ) {
				this.onConnectOOUI();
			}
		}
	} );
}
