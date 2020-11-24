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
						type: 'string',
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
						type: 'string',
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
						type: 'string',
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
	caption: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-table figcaption'
	},
	tableLayout: {
		type: 'string'
	},
	borderCollapse: {
		type: 'string'
	},
	horizontalAlign: {
		type: 'string'
	},
	verticalAlign: {
		type: 'string'
	},
	backgroundColor: {
		type: 'string'
	},
	textColor: {
		type: 'string'
	},
	customBackgroundColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	}
}

export default attributes;