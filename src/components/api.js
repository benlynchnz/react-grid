'use strict';

import Store from './store';
import request from 'superagent';
import q from 'q';

export default {
	fetch: (uri, req) => {
		let deferred = q.defer();

		if (req === 'fetchRows') {

			if (Store.getOptions().endpoint) {

				let req = request.get(uri),
					opts = Store.getOptions().endpoint;

				let headers = opts.headers.map((item) => {
					let values = _.pairs(item);
					return values.map((val) => {
						req.set(val[0], val[1]);
					});
				});

				console.log(req);

				req.end((err, result) => {
					if (result.body) {
						deferred.resolve(result.body);
					}
				});
			}

		} else {
			request
				.get(uri)
				.end(function(err, result) {
					if (result.body) {
						deferred.resolve(result.body);
					}
				});
		}

		return deferred.promise;
	}
}
