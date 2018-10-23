const {Component, Fragment} = wp.element;

export default class BackgroundVideo extends Component {
	render() {
		const {
			attributes: {
				backgroundVideoUrl,
				backgroundVideoAutoplay,
				backgroundVideoMute,
				backgroundVideoLoop,
				backgroundVideoPoster,
			},
			baseClass,
		} = this.props;

		const videoProps = {
			autoPlay: backgroundVideoAutoplay,
			muted: backgroundVideoMute,
			loop: backgroundVideoLoop,
			poster: backgroundVideoPoster ? backgroundVideoPoster : undefined
		};

		return (
			<Fragment>
				<video className={`${baseClass}__background-video`} {...videoProps}>
					<source src={backgroundVideoUrl} type="video/mp4"/>
				</video>
			</Fragment>
		);
	}
}