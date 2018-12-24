


var request = require('request');

		const accesstoken='EMAWfI9fg2QkVI03ftjFrojvX1clbNLe5ZAAjZCrVpN3w1VABLxucxoZAvnK5WXC5hSkZBeYk5zFJU8ikqC2fOUAL6b12ohj0SzyjUboDmIAZDZD';

    request('https://graph.accountkit.com/v1.0/me/?access_token='+accesstoken, function (error, response, body) {

      console.log(body);

	});
