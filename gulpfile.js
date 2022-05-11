const gulp = require('gulp'),
	plumber = require('gulp-plumber'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	rtlcss = require('gulp-rtlcss'),
	concat = require('gulp-concat'),
	webpack = require('webpack'),
	webpackConfig = require('./webpack.splitted.js');

const config = {
	destPath: 'assets/blocks/',
	cssOutputStyle: 0 <= process.argv.indexOf('--minified') ? 'compressed' : 'expanded', // compressed, expanded
}

const complexBlocks = {
	'accordion': 'accordion',
	'content-timeline': 'content-timeline',
	'media-text-slider': 'media-text-slider',
	'tabs': 'tabs',
	'toggle': 'toggle',
	'template-parts': {
		'template-parts/acf': 'acf'
	},
};

const rtlConfig = {
	plugins: [
		{
			'name': 'disable processors',
			'priority': 50,
			'directives': {
				'control': {},
				'value': []
			},
			'processors': [
				{
					'name': 'ignore all',
					'expr': /./im,
					'action': function (prop, value) {
						return { 'prop': prop, 'value': value }
					}
				}
			]
		}
	],
}

/**
 * Create and run task per each file defined inside function
 */
const buildIndependentCSS = (done) => {
	const styles = {
		'common.style': 'src/style.scss'
	};

	let tasks = [];
	for (const [name, path] of Object.entries(styles)) {
		tasks.push(taskDone => {
			gulp.src(path)
				.pipe(plumber())
				.pipe(sass({outputStyle: config.cssOutputStyle}))
				.pipe(autoprefixer())
				.pipe(rename({
					basename: name
				}))
				.pipe(gulp.dest(config.destPath))
				.pipe(rtlcss(rtlConfig))
				.pipe(rename({ suffix: '.rtl' }))
				.pipe(gulp.dest(config.destPath));
			taskDone();
		});
	}

	return gulp.parallel(...tasks, parallelDone => {
		parallelDone();
		done();
	})();
}

/**
 * Compile CSS for all blocks except blocks from complexBlocks var
 */
const buildSimpleBlocksCSS = () => {
	const excludeBlocks = Object.keys(complexBlocks).map(path => '!src/blocks/' + path + '/**');

	return gulp.src(['src/blocks/**/style.scss', ...excludeBlocks])
		.pipe(plumber())
		.pipe(sass({outputStyle: config.cssOutputStyle}))
		.pipe(autoprefixer())
		.pipe(gulp.dest(config.destPath))
		.pipe(rtlcss(rtlConfig))
		.pipe(rename({ suffix: '.rtl' }))
		.pipe(gulp.dest(config.destPath));
}

/**
 * Compile CSS only for blocks defined in complexBlocks var
 */
const buildComplexBlocksCSS = (done) => {
	let tasks = [];

	buildComplexBlockCSS(tasks, '', complexBlocks);

	return gulp.parallel(...tasks, parallelDone => {
		parallelDone();
		done();
	})();
}

/**
 * Helper function; runs task for each block in complexBlocks var
 */
const buildComplexBlockCSS = (tasks, block, subBlocks) => {
	let excludedBlocks = [];
	if (typeof subBlocks === 'object') {
		excludedBlocks = Object.keys(subBlocks).map(path => '!src/blocks/' + path + '/**');

		for (const [subBlock, value] of Object.entries(subBlocks)) {
			buildComplexBlockCSS(tasks, subBlock, value);
		}
	}

	block !== '' && tasks.push(taskDone => {
		buildComplexBlockPartCSS(block, excludedBlocks);
		taskDone();
	})
}

/**
 * Helper function; compile single block CSS
 */
const buildComplexBlockPartCSS = (block, excludeBlocks) => {
	gulp.src(['src/blocks/' + block + '/**/style.scss', ...excludeBlocks])
		.pipe(plumber())
		.pipe(sass({outputStyle: config.cssOutputStyle}))
		.pipe(autoprefixer())
		.pipe(concat('style.css'))
		.pipe(gulp.dest(config.destPath + block + '/'))
		.pipe(rtlcss(rtlConfig))
		.pipe(rename({ suffix: '.rtl' }))
		.pipe(gulp.dest(config.destPath + block + '/'));
}

/**
 * Runs tasks for compiling all blocks CSS parallel
 */
const buildFrontendCSS = (done) => {
	return gulp.parallel(buildSimpleBlocksCSS, buildComplexBlocksCSS, buildIndependentCSS, parallelDone => {
		parallelDone();
		done();
	})();
}

/**
 * Runs parallel tasks for .js compiling with webpack and .scss compiling
 */
const watchFrontendAssets = (done) => {
	return gulp.parallel(
		() => {
			return new Promise(resolve => webpack(webpackConfig, (err, stats) => {
				if (err) console.log('Webpack', err)

				console.log(stats.toString())

				resolve()
			}))
		},
		() => {
			return gulp.watch('src/**/*.scss', gulp.series(buildFrontendCSS))
		},
		(parallelDone) => {
			parallelDone();
			done();
		}
	)();

}

gulp.task('build-splitted', gulp.parallel(buildFrontendCSS));
gulp.task('watch-splitted', gulp.series(buildFrontendCSS, watchFrontendAssets));

