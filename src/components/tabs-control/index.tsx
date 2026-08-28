import { Button, Dashicon, PanelBody } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import './editor.scss';

type TabName = 'general' | 'style' | 'layout' | 'advanced';

type TabsControlProps = {
	state: TabName;
	onChangeTab: ( state: TabName ) => void;
	tabs?: TabName[];
};

const labels: Record< TabName, string > = {
	general: __( 'General', 'getwid' ),
	style: __( 'Style', 'getwid' ),
	layout: __( 'Layout', 'getwid' ),
	advanced: __( 'Advanced', 'getwid' ),
};

const icons: Record< TabName, string > = {
	general: 'admin-settings',
	style: 'admin-appearance',
	layout: 'layout',
	advanced: 'admin-generic',
};

export default function TabsControl( {
	state,
	onChangeTab,
	tabs = [ 'general', 'style', 'layout', 'advanced' ],
}: TabsControlProps ) {
	return (
		<PanelBody className="components-getwid-tabs-control">
			{ tabs.map( ( tabName ) => (
				<Fragment key={ tabName }>
					<Button
						className={ clsx( 'components-getwid-tab', {
							'is-selected': tabName === state,
						} ) }
						onClick={ () => onChangeTab( tabName ) }
					>
						<span>
							<Dashicon icon={ icons[ tabName ] } />
							{ labels[ tabName ] }
						</span>
					</Button>
				</Fragment>
			) ) }
		</PanelBody>
	);
}
