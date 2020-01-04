/**
 * External dependencies
 */
import './editor.scss';
import classnames from "classnames";


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	BaseControl,
	ButtonGroup,
	IconButton,
} = wp.components;

const { Fragment } = wp.element;


export default function GetwidCustomBackgroundControl (
	{
		state,
		label,
		stateName,
		onChangeBackgroundType,
		types = ['color','image','gradient','slider','video']
	} ) {

	return (
		<Fragment>
			<BaseControl
				label={label}
				className="components-getwid-background-types-control"
			>
					<ButtonGroup className="components-getwid-background-types-group">

						{ types.includes('color') && (
							<Fragment>
								<IconButton
									icon={ 'admin-customizer' }
									label={ __( 'Color' ) }
									className={ classnames(
										'wp-block-getwid-background-types-icon',
										'is-button',
										{ 'is-primary': 'color' === state }
									) }
									onClick={ () => {
										onChangeBackgroundType(stateName, 'color');
									}}
								/>
							</Fragment>
						)}

						{ types.includes('image') && (
							<IconButton
								icon={ 'format-image' }
								label={ __( 'Image' ) }
								className={ classnames(
									'wp-block-getwid-background-types-icon',
									'is-button',
									{ 'is-primary': 'image' === state }
								) }
								onClick={ () => {
									onChangeBackgroundType(stateName, 'image');
								}}
							/>
						)}

						{ types.includes('gradient') && (
							<IconButton
								icon={ 'art' }
								label={ __( 'Gradient' ) }
								className={ classnames(
									'wp-block-getwid-background-types-icon',
									'is-button',
									{ 'is-primary': 'gradient' === state }
								) }
								onClick={ () => {
									onChangeBackgroundType(stateName, 'gradient');
								}}
							/>
						)}						

						{ types.includes('slider') && (
							<IconButton
								icon={ 'images-alt2' }
								label={ __( 'Slider' ) }
								className={ classnames(
									'wp-block-getwid-background-types-icon',
									'is-button',
									{ 'is-primary': 'slider' === state }
								) }
								onClick={ () => {
									onChangeBackgroundType(stateName, 'slider');
								}}
							/>
						)}	

						{ types.includes('video') && (
							<IconButton
								icon={ 'video-alt3' }
								label={ __( 'Video' ) }
								className={ classnames(
									'wp-block-getwid-background-types-icon',
									'is-button',
									{ 'is-primary': 'video' === state }
								) }
								onClick={ () => {
									onChangeBackgroundType(stateName, 'video');
								}}
							/>
						)}
					</ButtonGroup>
			</BaseControl>
		</Fragment>
	);
}
