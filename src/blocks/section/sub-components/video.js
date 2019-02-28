const {Component, Fragment} = wp.element;

export default class BackgroundVideo extends Component {
	render() {
		const {
			attributes: {
				backgroundVideoUrl,
				backgroundVideoMute,
				backgroundVideoLoop,
				backgroundVideoPoster,
			},
			baseClass,
		} = this.props;

		const videoProps = {
			autoPlay: true,
			muted: backgroundVideoMute,
			loop: backgroundVideoLoop,
			poster: backgroundVideoPoster ? backgroundVideoPoster : undefined
		};

		return (
			<Fragment>
				<video className={`${baseClass}__background-video`} {...videoProps}>
					<source src={backgroundVideoUrl.url} type="video/mp4"/>
				</video>
			</Fragment>
		);
	}
}