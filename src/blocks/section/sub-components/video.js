const {Component, Fragment} = wp.element;

export default class BackgroundVideo extends Component {

	render() {
		const {
			attributes: {
				backgroundVideoUrl,
				backgroundVideoMute,
				backgroundVideoLoop,
				backgroundVideoAutoplay,
				backgroundVideoPoster,
			},
			baseClass,
		} = this.props;



		const videoProps = {
			autoPlay: this.props.videoAutoplay,
			muted: this.props.videoMute,
			loop: backgroundVideoLoop,
			poster: backgroundVideoPoster ? backgroundVideoPoster : undefined
		};

		return (
			<Fragment>
				<video className={`${baseClass}__background-video`} {...videoProps} ref={ this.props.videoElemRef } onEnded={ this.props.onVideoEnd }><source src={backgroundVideoUrl.url} type="video/mp4"/></video>
			</Fragment>
		);
	}

	componentDidMount(){
		// this.props.onVideoLoad();
	}

	componentDidUpdate(){
		// this.props.onVideoLoad();
	}
}