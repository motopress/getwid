const Attributes = {
	align: {
		type: 'string'
	},
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
    },
    title: {
        type: 'string',
        default: 'Plan A'
    },
    currency: {
        type: 'string',
        default: '$'
    },
    amount: {
        type: 'string',
        default: '99'
    },
    features: {
        type: 'string',
        default: 'Add features'
    }    
};

export default Attributes;