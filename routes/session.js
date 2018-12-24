'use strict';
const SessionController = require('../controllers/session');
module.exports = [
    {
        method: 'GET',
        path: '/sessions',
        config: {
            auth: {
                scope: ['admin']
            },
        },
        handler: SessionController.list
    },

    {
        method: 'GET',
        path: '/session/{id}',
        config: {
            auth: {
                scope: ['admin']
            },
        },
        handler: SessionController.get
    },
    {
        method: 'PUT',
        path: '/session/{id}',
        config: {
            auth: {
                scope: ['admin']
            },
        },
        handler: SessionController.update
    },
]
