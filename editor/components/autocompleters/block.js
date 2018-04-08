/**
 * External dependencies
 */
import { sortBy } from 'lodash';

/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import './style.scss';
import BlockIcon from '../block-icon';

/**
 * A blocks repeater for replacing the current block with a selected block type.
 *
 * @type {Completer}
 */
export default {
	name: 'blocks',
	className: 'editor-autocompleters__block',
	triggerPrefix: '/',
	options( query ) {
		const {
			getEditorSettings,
			getBlockInsertionPoint,
			getSupportedBlocks,
			getFrecentInserterItems,
			getInserterItems,
		} = select( 'core/editor' );

		const { allowedBlockTypes } = getEditorSettings();
		const { rootUID } = getBlockInsertionPoint();
		const supportedBlocks = getSupportedBlocks( rootUID, allowedBlockTypes );

		const isInitialQuery = ! query;
		const inserterItems = isInitialQuery ?
			// Before we have a query, offer frecent blocks as a sensible default.
			getFrecentInserterItems( supportedBlocks ) :
			getInserterItems( supportedBlocks );
		return sortBy( inserterItems, ( { category } ) => 'common' !== category );
	},
	getOptionKeywords( inserterItem ) {
		const { title, keywords = [] } = inserterItem;
		return [ ...keywords, title ];
	},
	getOptionLabel( inserterItem ) {
		const { icon, title } = inserterItem;
		return [
			<BlockIcon key="icon" icon={ icon } />,
			title,
		];
	},
	allowContext( before, after ) {
		return ! ( /\S/.test( before.toString() ) || /\S/.test( after.toString() ) );
	},
	getOptionCompletion( inserterItem ) {
		const { name, initialAttributes } = inserterItem;
		return {
			action: 'replace',
			value: createBlock( name, initialAttributes ),
		};
	},
};
