window.Widgets = {};

$( function () {
	var $scroll = $( '.scroll' );
	$( window ).on( 'scroll', function () {
		$scroll.toggleClass( 'scroll-visible', $( this ).scrollTop() > 100 );
	} );
	$scroll.on( 'click', function () {
		$( 'html, body' ).animate( { scrollTop: 0 }, 600 );
		return false;
	} );
} );
