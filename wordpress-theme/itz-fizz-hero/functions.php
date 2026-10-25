<?php
/**
 * Itz Fizz Hero theme setup.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'ITZFIZZ_VERSION', '1.0.0' );

add_action( 'after_setup_theme', function () {
	add_theme_support( 'title-tag' );
	add_theme_support( 'html5', array( 'style', 'script' ) );
} );

/**
 * Stats shown on the hero. Edit here, or override from a plugin / child theme:
 *   add_filter( 'itzfizz_stats', fn( $stats ) => [ ... ] );
 *
 * tone: sun | mint | tide | coral     side: top | bottom     x: horizontal centre in % (desktop)
 */
function itzfizz_get_stats() {
	$stats = array(
		array( 'value' => 58, 'text' => 'Increase in pick-up point use',     'tone' => 'sun',   'side' => 'top',    'x' => 17 ),
		array( 'value' => 23, 'text' => 'Decrease in customer phone calls',  'tone' => 'mint',  'side' => 'bottom', 'x' => 39 ),
		array( 'value' => 27, 'text' => 'Increase in pick-up point use',     'tone' => 'tide',  'side' => 'top',    'x' => 62 ),
		array( 'value' => 40, 'text' => 'Decrease in customer phone calls',  'tone' => 'coral', 'side' => 'bottom', 'x' => 84 ),
	);
	return apply_filters( 'itzfizz_stats', $stats );
}

/** Headline words (letters are split automatically). */
function itzfizz_get_words() {
	return apply_filters( 'itzfizz_words', array( 'WELCOME', 'ITZFIZZ' ) );
}

add_action( 'wp_enqueue_scripts', function () {
	$uri = get_template_directory_uri() . '/assets';

	// Bootstrap grid only (no reboot) so it can't restyle the page.
	wp_enqueue_style( 'itzfizz-bootstrap-grid', $uri . '/vendor/bootstrap-grid-lite.css', array(), '5.3.3' );
	wp_enqueue_style( 'itzfizz-hero', $uri . '/css/hero.css', array( 'itzfizz-bootstrap-grid' ), ITZFIZZ_VERSION );

	// Logged-in users see the WordPress admin bar (32px, or 46px on small screens).
	// Tell the hero about it so it fits the remaining viewport and pins below the bar.
	if ( is_admin_bar_showing() ) {
		wp_add_inline_style( 'itzfizz-hero', ':root{--ab:32px}@media(max-width:782px){:root{--ab:46px}}' );
	}

	// GSAP + ScrollTrigger + Lenis, bundled locally (no CDN needed).
	wp_enqueue_script( 'gsap', $uri . '/vendor/gsap.min.js', array(), '3.12.5', true );
	wp_enqueue_script( 'gsap-scrolltrigger', $uri . '/vendor/ScrollTrigger.min.js', array( 'gsap' ), '3.12.5', true );
	wp_enqueue_script( 'lenis', $uri . '/vendor/lenis.min.js', array(), '1.1.13', true );
	wp_enqueue_script( 'itzfizz-hero', $uri . '/js/hero.js', array( 'gsap', 'gsap-scrolltrigger', 'lenis' ), ITZFIZZ_VERSION, true );
} );

/** Preload the font so the headline never flashes in a fallback face. */
add_action( 'wp_head', function () {
	printf(
		'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
		esc_url( get_template_directory_uri() . '/assets/fonts/bricolage-grotesque-latin-wght-normal.woff2' )
	);
}, 1 );
