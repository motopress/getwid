/**
* External dependencies
*/
import classnames from "classnames";
import Inspector from './inspector';
import './editor.scss';


/**
* WordPress dependencies
*/
const { __ } = wp.i18n;
const {
	Fragment,
	Component
} = wp.element;
const {
	InnerBlocks,
} = wp.editor;


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
			setAttributes
		} = this.props;

		const wrapperClasses = classnames(
			'wp-block-getwid-button-group__wrapper',
			{
				[`wp-block-getwid-button-group--spacing-${spacing}`]: spacing !== '',

				[`wp-block-getwid-button-group--alignment-${alignment}`]: alignment !== 'left',
				[`wp-block-getwid-button-group--alignment-tablet-${alignmentTablet}`]: alignmentTablet !== '',
				[`wp-block-getwid-button-group--alignment-mobile-${alignmentMobile}`]: alignmentMobile !== '',

				[`wp-block-getwid-button-group--direction-${direction}`]: direction !== 'row',
				[`wp-block-getwid-button-group--direction-tablet-${directionTablet}`]: directionTablet !== '',
				[`wp-block-getwid-button-group--direction-mobile-${directionMobile}`]: directionMobile !== '',

				[`wp-block-getwid-button-group--width-${width}`]: width !== 'auto',
				[`wp-block-getwid-button-group--width-tablet-${widthTablet}`]: widthTablet !== 'auto',
				[`wp-block-getwid-button-group--width-mobile-${widthMobile}`]: widthMobile !== 'auto',
			}
		);
			
		return(
			<Fragment>

				<Inspector {...this.props} key={'inspector'}/>

				<div className={'wp-block-getwid-button-group'} key={'edit'}>
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