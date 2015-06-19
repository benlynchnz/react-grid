'use strict';

import request from 'superagent';
import q from 'q';

export default {
	fetch: (uri) => {
		let deferred = q.defer();

		request
			.get(uri)
			.end(function(err, result) {
				deferred.resolve(result.body);
			});

		return deferred.promise;
	}
}
