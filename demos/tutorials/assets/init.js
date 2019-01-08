window.Widgets = {};

$( function () {
	// eslint-disable-next-line jquery/no-global-selector
	var $scroll = $( '.scroll' );
	$( window ).on( 'scroll', function () {
		$scroll.toggleClass( 'scroll-visible', $( this ).scrollTop() > 100 );
	} );
	$scroll.on( 'click', function () {
		// eslint-disable-next-line jquery/no-animate
		$( [ document.documentElement, document.body ] ).animate( { scrollTop: 0 }, 600 );
		return false;
	} );
} );
