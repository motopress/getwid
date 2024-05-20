const { BaseControl, Dashicon, Tooltip } = wp.components;

const StyledTooltip = (props) => {
	return <Tooltip text={<div style={{maxWidth: '200px'}}>{props.content}</div>}>
		<span><Dashicon icon="editor-help" size="15"/></span>
	</Tooltip>;
}

export default (props) => {

	const { label, help, children } = props;

	return (
		<BaseControl>
			{ label && <BaseControl.VisualLabel>{label}{help && <StyledTooltip content={help}/>}</BaseControl.VisualLabel> }
			{ children }
		</BaseControl>
	);
}
