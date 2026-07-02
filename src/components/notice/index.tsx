import './editor.scss';

type NoticeProps = {
	children: JSX.Element | JSX.Element[] | string | number | null;
};

export default function Notice( { children }: NoticeProps ) {
	return <div className="components-getwid-notice">{ children }</div>;
}
