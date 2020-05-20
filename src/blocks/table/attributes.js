const attributes = {
	align: {
		type: 'string'
	},
	head: {
		type: 'array',
		source: 'query',
		selector: 'thead tr',
		query: {
			cells: {
				type: 'array',			
				source: 'query',
				selector: 'td',
				query: {
					value: {
						source: 'html'
					},
					colSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'colspan'
					},
					rowSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'rowspan'
					}
				},
				default: []
			}
		},
		default: []
	},
	body: {
		type: 'array',
		source: 'query',
		selector: 'tbody tr',
		query: {
			cells: {
				type: 'array',			
				source: 'query',
				selector: 'td',
				query: {
					value: {
						source: 'html'
					},
					colSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'colspan'
					},
					rowSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'rowspan'
					}
				},
				default: []
			}
		},
		default: []
	},
	foot: {
		type: 'array',
		source: 'query',
		selector: 'tfoot tr',
		query: {
			cells: {
				type: 'array',			
				source: 'query',
				selector: 'td',
				query: {
					value: {
						source: 'html'
					},
					colSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'colspan'
					},
					rowSpan: {
						type: 'string',
						source: 'attribute',
						attribute: 'rowspan'
					}
				},
				default: []
			}
		},
		default: []
	},
	hasFixedLayout: {
		type: 'boolean',
		default: true
	},
	tableCollapsed: {
		type: 'boolean',
		default: true
	},
	isPreview: {
		type: 'boolean',
		default: false
	}
}

export default attributes;