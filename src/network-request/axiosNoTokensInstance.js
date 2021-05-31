import axios from 'axios';

const baseURL = `${process.env.REACT_APP_API_DEV_LINK}`


//instance to send json data
const axiosNoTokensInstance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    }
})

axiosNoTokensInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}
		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosNoTokensInstance;