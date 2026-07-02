import {
	Button,
	MenuItem,
	Popover,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { createRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import CustomRepeater from '../../custom-repeater';
import type { MetaQueryCondition, MetaQueryGroup } from '../types';

type ConditionProps = {
	query: MetaQueryCondition;
	parentQuery: MetaQueryGroup;
	possibleMetaKeys: string[];
	updateMetaQuery: () => void;
};

export default function QueryCondition( {
	query,
	parentQuery,
	possibleMetaKeys,
	updateMetaQuery,
}: ConditionProps ) {
	const [ metaKeySuggestionsOpened, setMetaKeySuggestionsOpened ] =
		useState( false );
	const inputRef = createRef< HTMLInputElement >();
	const popoverRef = createRef< HTMLDivElement >();
	const removedSpacesTextCompare = query.compare.replace( / /g, '' );

	function removeCondition() {
		const index = parentQuery.children.indexOf( query );
		parentQuery.children.splice( index, 1 );
		updateMetaQuery();
	}

	return (
		<div className="components-getwid-custom-query-control__custom-query">
			<div>
				<TextControl
					ref={ inputRef }
					autoComplete="off"
					placeholder={ __( 'Key', 'getwid' ) }
					value={ query.key }
					onChange={ ( value ) => {
						query.key = value;
						updateMetaQuery();
					} }
					onClick={ () =>
						setMetaKeySuggestionsOpened(
							! metaKeySuggestionsOpened
						)
					}
					onBlur={ ( event ) => {
						const relatedTarget =
							event.relatedTarget as Node | null;

						if (
							relatedTarget &&
							popoverRef.current?.contains( relatedTarget )
						) {
							return;
						}

						setMetaKeySuggestionsOpened( false );
					} }
				/>
				{ metaKeySuggestionsOpened && (
					<Popover
						ref={ popoverRef }
						className="components-getwid-custom-query-control__meta-keys-dropdown"
						focusOnMount={ false }
					>
						{ possibleMetaKeys.map( ( metaKey ) => (
							<MenuItem
								key={ metaKey }
								onClick={ () => {
									query.key = metaKey;
									updateMetaQuery();
									inputRef.current?.focus();
								} }
							>
								{ metaKey }
							</MenuItem>
						) ) }
						{ possibleMetaKeys.length < 1 && (
							<p>
								{ __(
									'There are no suggestions for this query.',
									'getwid'
								) }
							</p>
						) }
					</Popover>
				) }
			</div>
			<SelectControl
				className="components-getwid-custom-query-control__custom-query--compare"
				value={ query.compare }
				onChange={ ( value ) => {
					query.compare = value;
					updateMetaQuery();
				} }
				options={ [
					{ value: '', label: __( 'Compare', 'getwid' ) },
					{ value: '=', label: '=' },
					{ value: '!=', label: '!=' },
					{ value: '>', label: '>' },
					{ value: '>=', label: '>=' },
					{ value: '<', label: '<' },
					{ value: '<=', label: '<=' },
					{ value: 'LIKE', label: 'LIKE' },
					{ value: 'NOT LIKE', label: 'NOT LIKE' },
					{ value: 'IN', label: 'IN' },
					{ value: 'NOT IN', label: 'NOT IN' },
					{ value: 'BETWEEN', label: 'BETWEEN' },
					{ value: 'NOT BETWEEN', label: 'NOT BETWEEN' },
					{ value: 'EXISTS', label: 'EXISTS' },
					{ value: 'NOT EXISTS', label: 'NOT EXISTS' },
					{ value: 'REGEXP', label: 'REGEXP' },
					{ value: 'NOT REGEXP', label: 'NOT REGEXP' },
					{ value: 'RLIKE', label: 'RLIKE' },
				] }
			/>
			{ removedSpacesTextCompare !== 'EXISTS' &&
				removedSpacesTextCompare !== 'NOTEXISTS' && (
					<CustomRepeater
						placeholder={ __( 'Value', 'getwid' ) }
						arrayData={ query.value }
					/>
				) }
			{ removedSpacesTextCompare !== 'EXISTS' &&
				removedSpacesTextCompare !== 'NOTEXISTS' && (
					<SelectControl
						className="components-getwid-custom-query-control__custom-query--type"
						value={ query.type }
						onChange={ ( value ) => {
							query.type = value;
							updateMetaQuery();
						} }
						options={ [
							{ value: '', label: __( 'Type', 'getwid' ) },
							{ value: 'NUMERIC', label: 'NUMERIC' },
							{ value: 'DECIMAL', label: 'DECIMAL' },
							{ value: 'SIGNED', label: 'SIGNED' },
							{ value: 'UNSIGNED', label: 'UNSIGNED' },
							{ value: 'CHAR', label: 'CHAR' },
							{ value: 'BINARY', label: 'BINARY' },
							{ value: 'DATETIME', label: 'DATETIME' },
							{ value: 'DATE', label: 'DATE' },
							{ value: 'TIME', label: 'TIME' },
						] }
					/>
				) }
			<Button
				label={ __( 'Remove Condition', 'getwid' ) }
				className="components-getwid-custom-query-control__custom-query--btn-close"
				icon="no-alt"
				iconSize={ 14 }
				onClick={ removeCondition }
			/>
		</div>
	);
}
