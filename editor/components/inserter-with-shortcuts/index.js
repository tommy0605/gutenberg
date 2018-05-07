/**
 * External dependencies
 */
import { reject, isEmpty, orderBy, flow } from 'lodash';

/**
 * WordPress dependencies
 */
import { createBlock, getDefaultBlockName } from '@wordpress/blocks';
import { compose } from '@wordpress/element';
import { IconButton } from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { withDispatch, withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import BlockIcon from '../block-icon';
import './style.scss';

function filterItems( items ) {
	return reject( items, ( item ) =>
		item.name === getDefaultBlockName() && isEmpty( item.initialAttributes )
	);
}

function orderItems( items ) {
	return orderBy( items, [ 'utility', 'frecency' ], [ 'desc', 'desc' ] );
}

function limitItems( items ) {
	return items.slice( 0, 3 );
}

function InserterWithShortcuts( { items, isLocked, onInsert } ) {
	if ( isLocked ) {
		return null;
	}

	const bestItems = flow( filterItems, orderItems, limitItems )( items );

	return (
		<div className="editor-inserter-with-shortcuts">
			{ bestItems.map( ( item ) => (
				<IconButton
					key={ item.id }
					className="editor-inserter-with-shortcuts__block"
					onClick={ () => onInsert( item ) }
					label={ sprintf( __( 'Add %s' ), item.title ) }
					icon={ (
						<BlockIcon icon={ item.icon } />
					) }
				/>
			) ) }
		</div>
	);
}

export default compose(
	withSelect( ( select, { rootUID } ) => {
		const { getEditorSettings, getInserterItems } = select( 'core/editor' );
		const { templateLock, allowedBlockTypes } = getEditorSettings();
		return {
			items: getInserterItems( allowedBlockTypes, rootUID ),
			isLocked: !! templateLock,
		};
	} ),
	withDispatch( ( dispatch, ownProps ) => {
		const { uid, rootUID, layout } = ownProps;

		return {
			onInsert( { name, initialAttributes } ) {
				const block = createBlock( name, { ...initialAttributes, layout } );
				if ( uid ) {
					dispatch( 'core/editor' ).replaceBlocks( uid, block );
				} else {
					dispatch( 'core/editor' ).insertBlock( block, undefined, rootUID );
				}
			},
		};
	} ),
)( InserterWithShortcuts );
