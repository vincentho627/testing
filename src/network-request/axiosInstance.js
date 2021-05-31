import axios from 'axios';

const baseURL = `${process.env.REACT_APP_API_DEV_LINK}`

//instance to send
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
        Authorization: localStorage.getItem("access_token") ? "JWT " + localStorage.getItem("access_token") : null,
        // accept: "application/json"
    }
})

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		console.log(error.response)

		if (typeof error.response === 'undefined') {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'auth/tokens/refresh/'
		) {
			window.location.href = '/login/';
			return Promise.reject(error);
		}

        // for(var key in error.response) {
        //     console.log(key)
        // }
        // console.log(error.response)
        // console.log("oieruhtirjt4khjewfrhiue4iu")

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log(tokenParts.exp);

				//if refresh token is still no expired (if user logged in withint a certain number of days)
				if (tokenParts.exp > now) {
					return axiosInstance
						.post('auth/tokens/refresh/', { refresh: refreshToken })
						.then((response) => {
							localStorage.setItem('access_token', response.data.access);
							localStorage.setItem('refresh_token', response.data.refresh);

							axiosInstance.defaults.headers['Authorization'] =
								'JWT ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'JWT ' + response.data.access;

							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					window.location.href = '/login/';
				}
			} else {
				console.log('Refresh token not found.');
				window.location.href = '/login/';
			}
		}

		if (error.response.data.detail==="Authentication credentials were not provided." && 
		error.response.status === 401 &&
		error.response.statusText === 'Unauthorized') {
			console.log('User not logged in.');
			window.location.href = '/login/';
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;