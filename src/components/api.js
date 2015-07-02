'use strict';

import Store from './store';
import request from 'superagent';
import q from 'q';

export default {
	bootstrap: (uri) => {
		let deferred = q.defer();

		request
			.get(uri)
			.end((err, result) => {
				if (result.body) {
					deferred.resolve(result.body);
				}

				if (result.text) {
					deferred.resolve(JSON.parse(result.text));
				}
			});

		return deferred.promise;
	},

	fetch: (uri) => {
		let deferred = q.defer();

		let req = request.get(uri),
			headers = Store.getOptions().request.headers;

		(headers || []).map((item) => {
			return _.pairs(item).map((val) => {
				req.set(val[0], val[1]);
			});
		});

		req.end((err, result) => {
			if (result.body) {
				deferred.resolve(result.body);
			}
		});

		return deferred.promise;
	}
}
