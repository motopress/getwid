/**
 * External dependencies
 */
import {times, mapValues, pickBy} from 'lodash';
import move from 'lodash-move';

/**
 *
 */
export default class ItemsAttributeManager {

	/**
	 * Schema {
	 *  %attributeName%: {
	 *      isWrapper {boolean}
	 *      attributes: {{
	 *          %attributeName%: {
	 *              alias: {string},
	 *              default: {mixed|function}
	 *          }
	 *      }}
	 *  }
	 * }
	 *
	 * @param {Object} schema
	 */
	constructor(schema) {
		this.schema = schema;
	}

	/**
	 *
	 * @param {Object} details
	 * @param {number} index
	 * @return {mixed}
	 * @private
	 */
	_getDefault(details, index) {
		return typeof details.default === 'function' ? details.default(index) : details.default;
	}

	/**
	 * Creates an Items state.
	 *
	 * @param {number} options.itemsCount    Items count for the items to create.
	 *
	 * @return {Object} New block state.
	 */
	createItems({
		itemsCount,
	}) {

		const newItems = mapValues(this.schema, (details, attName) => {
			return times(itemsCount, (i) => {
				if (details.isWrapper) {
					return mapValues(details.attributes, (innerDetails) => this._getDefault(innerDetails, i));
				} else {
					return this._getDefault(details, i);
				}
			});
		});

		return newItems;
	}


	/**
	 * Deletes an item from the block state.
	 *
	 * @param {Object} state            Current block state.
	 * @param {number} options.index  Item index to delete.
	 *
	 * @return {Object} New block state.
	 */
	deleteItem(state, {
		index,
	}) {
		return mapValues(
			this.schema,
			(details, attName) =>
				state[attName].filter((item, idx) => idx !== index)
		);
	}


	/**
	 * Inserts a row in the block state.
	 *
	 * @param {Object} state            Current block state.
	 * @param {number} options.index Item index at which to insert the item.
	 * @param {Object} [options.item]
	 *
	 * @return {Object} New block state.
	 */
	insertItem(state, {
		index,
		item
	}) {
		return mapValues(this.schema, (details, attName) => {
			return [
				...state[attName].slice(0, index),
				(
					details.isWrapper ? mapValues(details.attributes, (innerDetails) => {
						return item !== undefined ? item[innerDetails.alias] : this._getDefault(innerDetails, index);
					}) : (item !== undefined ? item[details.alias] : this._getDefault(details, index))
				),
				...state[attName].slice(index),
			]
		});
	}

	/**
	 *
	 * @param {Object} state Current block state.
	 * @param {number} options.index Item index at which to insert the item.
	 *
	 * @return {Object} New block state.
	 */
	duplicateItem(state, {
		index
	}) {
		return mapValues(this.schema, (details, attName) => {
			return [
				...state[attName].slice(0, index),
				state[attName][index],
				...state[attName].slice(index),
			]
		});
	}

	/**
	 * Updates item content in the block state.
	 *
	 * @param {Object} state               Current block state.
	 * @param {number} options.index        Index of the item to update.
	 * @param {Array}  options.itemState     Object of alias values.
	 *
	 * @return {Object} New block state.
	 */
	updateItem(state, {
		index,
		itemState,
	}) {

		const {attributes} = this.schema;

		let newState = {};
		let res = mapValues(this.schema, (details, attName) => {

			newState = mapValues(
				pickBy(details.attributes, (attDetails) => itemState.hasOwnProperty(attDetails.alias)),
				(attDetails) => itemState[attDetails.alias]
			);

			return state[attName].map((prevItemState, currentIndex) => {
				if (currentIndex !== index) {
					return prevItemState;
				}

				return {
					...prevItemState,
					...newState,
				};
			});
		});

		return res;
	}

	/**
	 * Move item to index.
	 *
	 * @param {Object} state               Current block state.
	 * @param {number} options.index        Index of the item to move.
	 * @param {number}  options.toIndex     Destination index.
	 *
	 * @return {Object} New block state.
	 */
	moveItem(state, {
		index,
		toIndex
	}) {
		return mapValues(this.schema, (details, attName) => move(state[attName], index, toIndex));
	}

}
