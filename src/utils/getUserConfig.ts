import storage from './Storage';

export const getThemesConfig = () => {
	const config = {
		primaryColor: storage.get('theme_primaryColor', '') || process.env.THEME_PRIMARY_COLOR || ''
	};
	return config;
};
