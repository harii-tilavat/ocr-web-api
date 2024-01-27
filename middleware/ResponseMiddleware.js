module.exports = async (request, response, next) => {
	try {
		const oldJson = response.json;
		response.json = (data, message, serviceData = null) => {
			let newResponseData = {};
			if (!data || data.code === 'ERROR') {
				newResponseData = {
					success: false,
					error: data,
				};
			} else {
				newResponseData = {
					success: true,
					message: message || '',
					...data,
				};
			}
			response.json = oldJson;
			return oldJson.call(response, newResponseData);
		};
		next();
	} catch (error) {
		next(error);
	}
};
