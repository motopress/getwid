const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

class Save extends Component {
    constructor() {
		super(...arguments);
    } 
    
    render() {
        const {
            attributes: {
                boolAttr,
                textAttr,
                imgAttr,
                numAttr,
                selectAttr,
            },
        } = this.props;

        return [
            <Fragment>
                <img src={(typeof imgAttr != "undefined" ? imgAttr.url : undefined )} />
            </Fragment>
        ];        
    } 
}

export default (Save);