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
				selector: 'th',
				query: {
					content: {
						source: 'html'
					},
					styles: {
						type: 'string',
						source: 'attribute',
						attribute: 'style'
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
					content: {
						source: 'html'
					},
					styles: {
						type: 'string',
						source: 'attribute',
						attribute: 'style'
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
					content: {
						source: 'html'
					},
					styles: {
						type: 'string',
						source: 'attribute',
						attribute: 'style'
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
		default: false
	},
	tableCollapsed: {
		type: 'string'
	}
}

export default attributes;