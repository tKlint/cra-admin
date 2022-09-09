import { useIntl } from 'react-intl';
import enUS from './en_US';
import zhCN from './zh_CN';
import zhTW from './zh_TW';
const locales = {
	zh_CN: zhCN,
	zh_TW: zhTW,
	en_US: enUS,
}

export const useLocale = () => {
	const { formatMessage: _formatMessage, ...rest } = useIntl();
	const formatMessage = _formatMessage;
	return {
		...rest,
		formatMessage
	};
};

export default locales;