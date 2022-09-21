const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
	app.use(
		'/gateway/admin/',
		createProxyMiddleware({
			target: 'https://bwecomonitorfrontdev.bravowhale-uat.com',
			changeOrigin: true,
			pathRewrite: { '^/api': '' }
		})
	);
};
