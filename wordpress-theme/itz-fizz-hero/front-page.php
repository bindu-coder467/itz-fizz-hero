<?php
/**
 * Front page: scroll-driven hero + a short follow-up section.
 */
get_header();

$stats = itzfizz_get_stats();
$words = itzfizz_get_words();
$car   = get_template_directory_uri() . '/assets/img/car.svg';
$label = esc_attr( apply_filters( 'itzfizz_headline_label', 'Welcome Itz Fizz' ) );
?>
<main>
	<section id="top" class="iz-hero" data-hero>
		<header class="iz-nav" data-intro>
			<span class="iz-brand"><?php bloginfo( 'name' ); ?></span>
			<a class="iz-pill" href="#more"><?php esc_html_e( 'Get in touch', 'itz-fizz-hero' ); ?></a>
		</header>

		<div class="iz-stage">
			<div class="iz-road" data-road>
				<div class="iz-trail" data-trail aria-hidden="true"></div>

				<h1 class="iz-headline" aria-label="<?php echo $label; ?>">
					<?php foreach ( $words as $word ) : ?>
						<span class="iz-word" aria-hidden="true">
							<?php foreach ( preg_split( '//u', $word, -1, PREG_SPLIT_NO_EMPTY ) as $ch ) : ?>
								<span class="iz-letter" data-intro data-letter><?php echo esc_html( $ch ); ?></span>
							<?php endforeach; ?>
						</span>
					<?php endforeach; ?>
				</h1>

				<div class="iz-car-track" data-car>
					<div class="iz-car-intro" data-intro data-car-intro>
						<div class="iz-car-sway" data-sway>
							<img class="iz-car-img" src="<?php echo esc_url( $car ); ?>" alt="<?php esc_attr_e( 'Orange sports car seen from above', 'itz-fizz-hero' ); ?>" draggable="false">
						</div>
					</div>
				</div>
			</div>
		</div>

		<?php foreach ( $stats as $i => $s ) : ?>
			<div class="iz-stat-wrap iz-pos-<?php echo (int) $i; ?> iz-<?php echo esc_attr( $s['side'] ); ?>" data-stat-wrap style="--x: <?php echo (float) $s['x']; ?>%">
				<div class="iz-stat iz-tone-<?php echo esc_attr( $s['tone'] ); ?>" data-stat data-intro>
					<p class="iz-stat-num" data-num="<?php echo (int) $s['value']; ?>"><?php echo (int) $s['value']; ?>%</p>
					<p class="iz-stat-text"><?php echo esc_html( $s['text'] ); ?></p>
				</div>
			</div>
		<?php endforeach; ?>

		<p class="iz-hint" data-intro data-hint><span data-hint-text><?php esc_html_e( 'Scroll to drive', 'itz-fizz-hero' ); ?></span></p>
		<div class="iz-progress"><div class="iz-progress-bar" data-bar></div></div>
	</section>

	<!-- Layout below uses Bootstrap's grid -->
	<section id="more" class="iz-more">
		<div class="container">
			<div class="row gy-5 align-items-end">
				<div class="col-12 col-lg-7">
					<h2><?php esc_html_e( 'Parcels arrive where people already are.', 'itz-fizz-hero' ); ?></h2>
				</div>
				<div class="col-12 col-lg-5">
					<p><?php esc_html_e( 'Pick-up points near home, work and the station mean fewer missed deliveries, fewer support calls and a lower cost for every parcel.', 'itz-fizz-hero' ); ?></p>
					<a class="iz-btn" href="#top"><?php esc_html_e( 'Back to the top', 'itz-fizz-hero' ); ?></a>
				</div>
			</div>
		</div>
	</section>
</main>
<?php
get_footer();
