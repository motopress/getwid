/**
* External dependencies
*/
import classnames from "classnames";
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Fragment,
	Component
} = wp.element;
const {
	InnerBlocks,
} = wp.blockEditor || wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-button-group';


/**
* Module Constants
*/
const TEMPLATE = [
	['core/button', {text: __('Button', 'getwid') }],
	['core/button', {text: __('Button', 'getwid') }]
];


/**
* Create an Component
*/
class Edit extends Component{

	constructor(){
		super( ...arguments );
	}

	render(){
		const {
			attributes:{
				spacing,

				alignment,
				alignmentTablet,
				alignmentMobile,

				direction,
				directionTablet,
				directionMobile,

				width,
				widthTablet,
				widthMobile,
			},
			setAttributes,
			className
		} = this.props;

		const wrapperClasses = classnames(
			`${baseClass}__wrapper`,
			{
				[`has-spacing-${spacing}`]: spacing !== '',

				[`has-alignment-${alignment}`]: alignment !== 'left',
				[`has-alignment-tablet-${alignmentTablet}`]: alignmentTablet !== '',
				[`has-alignment-mobile-${alignmentMobile}`]: alignmentMobile !== '',

				[`has-direction-${direction}`]: direction !== 'row',
				[`has-direction-tablet-${directionTablet}`]: directionTablet !== '',
				[`has-direction-mobile-${directionMobile}`]: directionMobile !== '',

				[`has-width-${width}`]: width !== 'auto',
				[`has-width-tablet-${widthTablet}`]: widthTablet !== 'auto',
				[`has-width-mobile-${widthMobile}`]: widthMobile !== 'auto',
			}
		);
			
		return(
			<Fragment>

				<Inspector {...this.props} key={'inspector'}/>

				<div className={className} key={'edit'}>
					<div className={wrapperClasses}>
						<InnerBlocks
							template={TEMPLATE}
							allowedBlocks={['core/button']}
							templateInsertUpdatesSelection={ false }
						/>
					</div>
				</div>

			</Fragment>
		)

	}
}

export default Edit;