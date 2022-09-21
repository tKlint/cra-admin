const api = {
	fetchUserRoute() {
		return new Promise(resolve => {
			setTimeout(
				() =>
					resolve({
						code: 200,
						data: [
							{
								id: 1,
								router: '/dashboard',
								name: 'dashboard',
								isShown: true,
								component: '/dashboard',
								icon: ''
							},
							{
								id: 2,
								router: '/about',
								name: 'about',
								component: '/about',
								isShown: true,
								icon: ''
							}
						]
					}),
				1000
			);
		});
	}
};
export default api;
