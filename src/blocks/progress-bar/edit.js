import Inspector from './inspector';
import classnames from 'classnames';

const { __ } = wp.i18n;

const { compose } = wp.compose;

const { Component, Fragment } = wp.element;
const { RichText, withColors } = wp.editor;

class Edit extends Component {

	constructor() {
		super(...arguments);

		this.animate = this.animate.bind(this);
		this.showProgressBar = this.showProgressBar.bind(this);
		this.resetWidth = this.resetWidth.bind(this);
		this.showCircle = this.showCircle.bind(this);

		const { attributes: { isAnimated } } = this.props;

		this.state = {
			fillComplete: !isAnimated ? true : false,
			isVisible: false,
			holderWidth: undefined
		}
	}

	render() {
		const {
			attributes: {
				fillAmount,
				customBackgroundColor,
				customTextColor,
				title,
				typeBar
			},

			clientId,
			className,
			setAttributes,

			backgroundColor,
			textColor

		} = this.props;

		if (fillAmount === undefined) {
			setAttributes({ fillAmount: 0 });
		}

		let currentAmount = fillAmount ? fillAmount : 0;

		const { fillComplete, holderWidth } = this.state;

		const showPercent = () => {
			const { fillComplete } = this.state;
			return fillComplete ? currentAmount.toString() + '%' : null;
		}

		const wrapperHolderProps = {
			className: classnames(`${className}__content-holder`,
				{
					[`${className}__content-holder`]: !this.props.backgroundColor.color,
					'has-background': backgroundColor.color,
					[backgroundColor.class]: backgroundColor.class,
				}),
			style: { backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color : customBackgroundColor }
		}

		const wrapperContentProps = {
			className: classnames(`${className}__content`,
				{
					'has-text-color': textColor.color,
					[textColor.class]: textColor.class,
				}),
			style: {
				backgroundColor: (typeof this.props.attributes.textColor != 'undefined'
					&& typeof this.props.attributes.textColor.class == 'undefined') ?
					this.props.textColor.color : (customTextColor ? customTextColor : undefined),

				width: fillComplete ? (holderWidth * currentAmount) / 100 : '0%'
			}
		}

		const isCircle = typeBar === undefined ? false : typeBar === 'default' ? false : true;

		console.log(typeBar);
		console.log(fillAmount);

		return (
			<Fragment>
				<Inspector {...this.props} />
				<div className={classnames(className, {
					'circle-bar-type': isCircle
				})}>
					<div className={`${className}__wrapper ${clientId}`}>
						<div className={`${className}__title-holder`}>

							<RichText
								tagName="h5"
								className={`${className}__title`}
								placeholder={__('Enter title here...', 'getwid')}
								value={title ? title : ''}
								onChange={title => setAttributes({ title })}
								keepPlaceholderOnFocus={true}
								multiline={false}
							/>

							{!isCircle && (
								<span className={`${className}__percent`}>{showPercent()}</span>
							)}
						</div>

						{isCircle && (
							<div className={`${className}__content-holder`}>
								<div className={`${className}__circle-foreground`}></div>
								{/* <div id="shadowring"></div> */}
								<div className={`${className}__circle-background`}></div>
								<canvas height="200" width="200" id="counter"/>
								{/* <script type="application/javascript">
									{ this.showCircle() }
								</script> */}
							</div>
						)}
						{!isCircle && (
							<div {...wrapperHolderProps}>
								<div {...wrapperContentProps}></div>
							</div>
						)}
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps) {
		const {
			attributes: {
				isAnimated,
				fillAmount,
				typeBar
			},
		} = this.props;

		if (!isAnimated) {
			this.resetWidth(fillAmount);
		}

		if (prevProps.attributes.typeBar != typeBar) {
			if (this.props.attributes.typeBar === 'default') {
				this.resetWidth();
				this.showProgressBar();
			}
		}
	}

	componentDidMount() {
		//this.showProgressBar();

		// $(document).ready(() => {
		 	this.showCircle();
		// })		
	}

	resetWidth(percent = 0) {
		const { clientId, className } = this.props;
		$(`.${clientId}`).find(`.${className}__content`).css('width', `${percent}%`);
	}

	animate() {
		const {
			attributes: {
				fillAmount
			},
			className,

		} = this.props;

		let $progress = $(ReactDOM.findDOMNode(this));
		let $content = $(`.${className}__content`, $progress);

		const percent = () => { return Math.ceil(($content.width() / $content.parent().width()) * 100); }

		$content.animate({ width: `${fillAmount}%` }, {
			duration: 2000,
			progress: () => {
				let $percent = $(`.${className}__percent`, $progress);
				$percent.text(percent() + '%');
			},
			complete: () => {
				this.setState({
					fillComplete: true,
					holderWidth: $content.parent().width()
				});
			}
		});
	}

	showProgressBar() {
		const {
			attributes: {
				isAnimated,
				fillAmount
			},

			isInViewport,
			scrollHandler,

			className,
			clientId
		} = this.props;

		const $id = $(`.${clientId}`);
		const $bar = $id.find(`.${className}__content`);

		const root = '.edit-post-layout__content';

		if (isAnimated) {
			if (isInViewport($bar)) {
				this.animate($bar);
			} else {
				scrollHandler(root, $bar, () => {
					this.animate($bar);
				});
			}
		} else {
			$id.find(`.${className}__content`).css('width', `${fillAmount}%`);
			$id.find(`.${className}__percent`).text(`${fillAmount}%`);
		}
	}
	
	showCircle() {
		var counter = document.getElementById('counter').getContext('2d');
        var no = 0; // Starting Point
        var pointToFill = 4.72;  //Point from where you want to fill the circle
        var cw = counter.canvas.width;  //Return canvas width
        var ch = counter.canvas.height; //Return canvas height
        var diff;   // find the different between current value (no) and trageted value (100)
        
        function fillCounter(){
            diff = ((no/100) * Math.PI*2*10);
            
            counter.clearRect(0,0,cw,ch);   // Clear canvas every time when function is call
            
            counter.lineWidth = 15;     // size of stroke
            
            counter.fillStyle = '#fff';     // color that you want to fill in counter/circle
            
            counter.strokeStyle = '#F5E0A9';    // Stroke Color
            
            counter.textAlign = 'center';
            
            counter.font = "25px monospace";    //set font size and face
            
            counter.fillText(no+'%',100,110);       //fillText(text,x,y);
            
            counter.beginPath();
            counter.arc(100,100,90,pointToFill,diff/10+pointToFill);    //arc(x,y,radius,start,stop)
            
            counter.stroke();   // to fill stroke
            
            // now add condition
            
            if(no >= 80)
            {
                clearTimeout(fill);     //fill is a variable that call the function fillcounter()
            }
            no++;
        }
        
        //now call the function
        
        var fill = setInterval(fillCounter,50);     //call the fillCounter function after every 50MS
	}
}

export default compose([
	withColors('backgroundColor', { textColor: 'color' }),
])(Edit);