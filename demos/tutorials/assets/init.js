window.Widgets = {};

$( () => {
	// eslint-disable-next-line no-jquery/no-global-selector
	const $scroll = $( '.tutorials-scroll' );
	$( window ).on( 'tutorials-scroll', function () {
		$scroll.toggleClass( 'tutorials-scroll-visible', $( this ).scrollTop() > 100 );
	} );
	$scroll.on( 'click', () => {
		$( [ document.documentElement, document.body ] ).animate( { scrollTop: 0 }, 600 );
		return false;
	} );
} );
