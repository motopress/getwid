import Inspector from './inspector';

import {
	pick,
    get,
    map,
	times
} from "lodash";

const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

//********************************************************************* */
const {
	BlockControls,
	MediaUpload,
    BlockAlignmentToolbar,
    MediaPlaceholder
} = wp.editor;

const {
	IconButton,
	Toolbar,
} = wp.components;

const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];

export const pickRelevantMediaFiles = ( image, imageSize ) => {
	const imageProps = pick( image, [ 'id', 'link', 'caption' ] );
	imageProps.original_url = image.url || image.source_url;
	imageProps.alt = image.alt || image.alt_text;
	imageProps.url = get( image, [ 'sizes', imageSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || image.url;
	return imageProps;
};
//********************************************************************* */

class Edit extends Component {
    constructor() {
        super(...arguments);
        
        //****************************************************************** */
        this.onSelectImages = this.onSelectImages.bind( this );
        this.setAttributes = this.setAttributes.bind( this );
        //****************************************************************** */
    }


    //**************************************************************************** */
    setAttributes( attributes ) {        
		if ( attributes.ids ) {
			throw new Error( 'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes' );
		}

		if ( attributes.images ) {
			attributes = {
				...attributes,
				ids: map( attributes.images, 'id' ),
			};
        }
        debugger;

		this.props.setAttributes( attributes );
	}

    onSelectImages( images ) {
		this.setAttributes( {
			images: images.map( ( image ) => pickRelevantMediaFiles( image, this.props.attributes.imageSize ) ),
		} );
    }
    //**************************************************************************** */
    
    render() {
        const {
            attributes: {
                boolAttr,
                textAttr,
                imgAttr,
                numAttr,
                selectAttr,
                //*********************** */
                align,
                images,
                //*********************** */
            },
            setAttributes,
            className,
        } = this.props;

        const imageRender = () => {
            
            if (!boolAttr || imgAttr.length == 0) return;

            if (selectAttr != 'all') {
                var imgUrl = imgAttr.filter((item) => {
                    return item.id == selectAttr;
                });

                // var imgUrl = imgAttr.find((item) => { 
                //     return item.id == selectAttr;
                // });

                debugger;

                return <img src={imgUrl[0].url} />;
            } else {
                var urls = imgAttr.map((item) => {
                    return item.url;
                });
                var imgTag = [];
                for (let i = 0; i < numAttr; i++) {                    
                    imgTag[i] = <img src={urls[i]} />;
                }
                return imgTag;
            }
        }
        //******************************************************************************************** */
        // const controls = (
		// 	<Fragment>
		// 		<BlockControls>
		// 			<BlockAlignmentToolbar
		// 				controls= {alignmentsList}
		// 				value={ align }
		// 				onChange={align => setAttributes({align})}
		// 			/>			
		// 			{ //!! images.length && (
		// 				<Toolbar>
		// 					<MediaUpload
		// 						onSelect={ this.onSelectImages }
		// 						allowedTypes={ ALLOWED_MEDIA_TYPES }
		// 						multiple
		// 						gallery
		// 						value={ images.map( ( img ) => img.id ) }
		// 						render={ ( { open } ) => (
		// 							<IconButton
		// 								className="components-toolbar__control"
		// 								label={ __( 'Edit Gallery', 'getwid' ) }
		// 								icon="edit"
		// 								onClick={ open }
		// 							/>
		// 						) }
		// 					/>
		// 				</Toolbar>
        //             }
		// 			//) }
		// 		</BlockControls>
		// 	</Fragment>
        // );

        if ( images.length === 0 ) {
			return (
				<Fragment>
					{/* { controls } */}
					<MediaPlaceholder
						icon="format-gallery"
						className={ className }
						labels={ {
							title: __( 'Stack Gallery', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.' ),
						} }
						onSelect={ this.onSelectImages }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple
					/>
				</Fragment>
			);
		}
        //******************************************************************************************** */

        return [
            //<Inspector {...this.props} />,
            // <Fragment>
            //     { imageRender() }
            //     <span> {textAttr} </span>
            // </Fragment>

            <Fragment>
                {/* { controls } */}
            </Fragment>            
        ];
    }
}

export default (Edit);