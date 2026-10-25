Itz Fizz Hero — WordPress theme
================================
Install: zip this folder (itz-fizz-hero/) → WordPress admin → Appearance → Themes → Add New → Upload Theme → Activate.
The hero is the front page (front-page.php). Set Settings → Reading → "Your homepage displays: Your latest posts" or any page; the template loads either way.

Edit the stats / headline: functions.php → itzfizz_get_stats() / itzfizz_get_words(),
or override from a plugin or child theme with add_filter( 'itzfizz_stats', ... ).

Everything is bundled locally (GSAP, ScrollTrigger, Lenis, Bootstrap grid, font): no CDN, no build step.

Logged in? The theme accounts for the WordPress admin bar (the hero fits the remaining height and pins below the bar).
Tested on a real WordPress install (WP-CLI install, theme uploaded as a zip, activated, front page rendered, no PHP warnings from the theme).
