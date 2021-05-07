const gulp = require('gulp'),
	babel = require('gulp-babel'),
	plumber = require('gulp-plumber'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	rollup     = require('gulp-rollup'),
webpack = require('webpack');

const config = {
	destPath: 'assets/blocks/',
	cssOutputStyle: 'expanded', // compressed, expanded
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

/**
 * Create and run task per each file defined inside function
 */
const buildIndependentCSS = (done) => {
	const styles = {
		'common.style': 'src/style.scss'
	};

	let tasks =[];
	for (const [name, path] of Object.entries(styles)) {
		tasks.push(taskDone => {
			gulp.src(path)
				.pipe(plumber())
				.pipe(sass({outputStyle: config.cssOutputStyle}))
				.pipe(autoprefixer())
				.pipe(rename({
					basename: name
				}))
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
 * Runs tasks for compiling blocks frontend JS
 */
const buildFrontendJS = () => {
	return gulp.src(['src/frontend/blocks/**/*.js', '!src/frontend/blocks/index.js'])
		.pipe(plumber())
		.pipe(babel())
		.pipe(uglify({
			output: {
				comments: '/^!/'
			}
		}))
		.pipe(rename({
			basename: 'frontend'
		}))
		.pipe(gulp.dest(config.destPath));
}

gulp.task('build', gulp.parallel(buildFrontendCSS, buildFrontendJS));

