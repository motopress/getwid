const { Component, Fragment } = wp.element;

export default class BackgroundVideo extends Component {

	render() {

		const { backgroundVideoUrl, backgroundVideoLoop, backgroundVideoPoster, backgroundVideoAutoplay } = this.props.attributes;
		const { baseClass } = this.props;

		const videoProps = {
			autoPlay: backgroundVideoAutoplay,
			muted   : this.props.videoMute,

			loop  : backgroundVideoLoop,
			poster: backgroundVideoPoster ? backgroundVideoPoster : undefined
		};

		return (
			<Fragment>
				{backgroundVideoUrl.url && (
					<video
						className={`${baseClass}__background-video`} {...videoProps}
						ref={this.props.videoElemRe}
						onEnded={this.props.onVideoEnd}
					>
						<source src={backgroundVideoUrl.url} type='video/mp4'/>
					</video>
				)}
			</Fragment>
		);
	}

	componentDidMount() {
		// this.props.onVideoLoad();
	}

	componentDidUpdate() {
		// this.props.onVideoLoad();
	}
}