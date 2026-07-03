const { src, dest, series, watch } = require( 'gulp' );
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const postcss = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const rtlcss = require( 'gulp-rtlcss' );
const rename = require( 'gulp-rename' );

function buildStyles() {
	return src( [
		'src/common-styles/style.scss',
		'src/common-styles/editor.scss',
	] )
		.pipe(
			sass( {
				outputStyle: 'expanded',
			} ).on( 'error', sass.logError )
		)
		.pipe( postcss( [ autoprefixer() ] ) )
		.pipe( dest( 'assets/common-styles' ) );
}

function buildRtlStyles() {
	return src( [
		'assets/common-styles/style.css',
		'assets/common-styles/editor.css',
	] )
		.pipe( rtlcss() )
		.pipe(
			rename( {
				suffix: '-rtl',
			} )
		)
		.pipe( dest( 'assets/common-styles' ) );
}

function watchStyles() {
	watch(
		'src/common-styles/**/*.scss',
		series( buildStyles, buildRtlStyles )
	);
}

exports.build = series( buildStyles, buildRtlStyles );
exports.start = watchStyles;
exports.default = exports.styles;
