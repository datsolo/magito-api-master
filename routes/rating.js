'use strict';
const RatingController = require('../controllers/rating');
module.exports = [
    {
        method: 'GET',
        path: '/ratings',
        config:{
            auth: {
                scope: ['admin', 'host', 'worker']
            },
        },
        handler: RatingController.list,
    },
    {
        method: 'GET',
        path: '/ratings/value',
        config:{
            auth: {
                scope: ['admin', 'host', 'worker']
            },
        },
        handler: RatingController.getRatingValue,
    },
    {
        method: 'POST',
        path: '/rating',
        config:{
            auth: {
                scope: ['admin', 'host', 'worker']
            },
        },
        handler: RatingController.create
    },
    {
        method: 'DELETE',
        path: '/rating/{id}',
        config:{
            auth: {
                scope: ['admin']
            },
        },
        handler: RatingController.remove
    },
    {
        method: 'DELETE',
        path: '/ratings',
        config:{
            auth: {
                scope: ['admin']
            },
        },
        handler: RatingController.removeByAccount
    },
    {
        method: 'DELETE',
        path: '/rating/empty',
        config:{
            auth: {
                scope: ['admin']
            },
        },
        handler: RatingController.empty
    }
]
