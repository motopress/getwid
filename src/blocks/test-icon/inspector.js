import {pick, map} from "lodash";

const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
    InspectorControls,
    MediaUpload,
} = wp.editor;

const {
    SelectControl,
    Button,
	TextControl,
    ToggleControl,
    
} = wp.components;

class Inspector extends Component {
    constructor() {
		super(...arguments);
    }
    
    render() {
        const {
            attributes: {
                boolAttr,
                textAttr,
                imgAttr,
                //****************** */
                ids,
                //****************** */
                numAttr,
                selectAttr,
            },
            setAttributes,
            className,
        } = this.props;

        console.log(Getwid.settings.image_sizes);

        //value={typeof imgAttr != "undefined"  ? imgAttr.id : undefined}
        return (
            <InspectorControls>
                <ToggleControl
                    label={__('ToggleControl', 'getwid')}
                    checked={boolAttr}
                    onChange={() => { setAttributes({
                            boolAttr: !boolAttr,
                        })
                    }}
                />
                <TextControl
                    label={__('TextControl', 'getwid')}
                    value={textAttr}
                    onChange={(value) => { setAttributes({textAttr: value}) }}
                />
                <MediaUpload
                    multiple
                    //gallery
                    title={__('Image', 'getwig')}
                    onSelect={(imgAttr) => {                        
                        //console.log(imgAttr);
                        const imgObj = imgAttr.map( ( image ) => pick(image, ['id', 'url']) );

                        //******************************************************************** */
                        //imgAttr.map((item) => { console.log(item.id); })
                        //******************************************************************** */

                        setAttributes({
                            imgAttr: imgObj,
                            ids: map( imgObj, 'id' ),
                            //imgAttr: pick(imgAttr, ['id', 'url']),
                        });
                    } }
                    
                    value={ imgAttr.map( ( img ) => img.id ) }   //храним айдишники

                    render={ ( { open } ) => (
                        <Fragment>
                            { 
                                !!imgAttr &&
                                <div className="background-img">
                                    <img src={imgAttr.url} />
                                </div>
                            }
                            
                            <Button onClick={ open }>
                                Open Media Library
                            </Button>
                        </Fragment>                                            
                    ) }
                />

                <SelectControl
                    //multiple
                    label={__('Select some numbers')}
                    value={selectAttr}
                    onChange={(value) => {

                        //************************************************** */
                        //console.log(selectAttr);
                        console.log(value);
                        //************************************************** */

                        setAttributes({selectAttr: value}) 
                    } }
                    // options={[
                    //     { value: 'a', label: 'first option ' },
                    //     { value: 'b', label: 'second option' },
                    //     { value: 'c', label: 'third option ' },
                    // ]}

                    options={
                        (imgAttr ? 
                        [...imgAttr.map((item) => {
                            //debugger;
                            //console.log("imgId: " + item.id);

                            return { value: item.id, label: `${ item.id }` }
                        }),...[{ value: 'all', label: 'all' }]] : [])
                    }
                />

                <TextControl
                    type="number"
                    label={__('Padding', 'getwid')}
                    value={numAttr}

                    onChange={numAttr => {
                        numAttr = parseInt(numAttr);
                        if (isNaN(numAttr)) {
                            numAttr = undefined;
                        }
                        setAttributes({ numAttr })
                    }}
                />
            </InspectorControls>
        );
    }
}

export default (Inspector);