window.Widgets = {};

$( function () {
	// eslint-disable-next-line no-jquery/no-global-selector
	var $scroll = $( '.tutorials-scroll' );
	$( window ).on( 'tutorials-scroll', function () {
		$scroll.toggleClass( 'tutorials-scroll-visible', $( this ).scrollTop() > 100 );
	} );
	$scroll.on( 'click', function () {
		$( [ document.documentElement, document.body ] ).animate( { scrollTop: 0 }, 600 );
		return false;
	} );
} );
