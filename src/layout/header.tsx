import { Col, Dropdown, Menu, MenuProps, Row } from 'antd';
import { ReactComponent as LanguageSvg } from '../assets/header/language.svg';
import { ReactComponent as ZhCnSvg } from '../assets/header/zh_CN.svg';
import { ReactComponent as EnUsSvg } from '../assets/header/en_US.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { LocaleStatus, TOGGLE_LOCALED } from '../store/locale';

export default function HeaderComponent() {
	const { locale } = useAppSelector(state => state.localesReducer);
	const dispatch = useAppDispatch();
	const isZhCn = locale === LocaleStatus.ZH_CN;
	const isZhTw = locale === LocaleStatus.ZH_TW;
	const isUsEn = locale === LocaleStatus.US_EN;
	const menuItems: MenuProps['items'] = [
		{
			disabled: isZhCn,
			key: LocaleStatus.ZH_CN,
			label: (
				<>
					<ZhCnSvg /> 简体中文
				</>
			)
		},
		{
			disabled: isZhTw,
			key: LocaleStatus.ZH_TW,
			label: (
				<>
					<ZhCnSvg /> 繁體中文
				</>
			)
		},
		{
			disabled: isUsEn,
			key: LocaleStatus.US_EN,
			label: (
				<>
					<EnUsSvg /> English
				</>
			)
		}
	];
	/**
	 * 切换语言
	 * @param event
	 */
	const toggleLanguage: MenuProps['onClick'] = event => {
		const target = event.key as LocaleStatus;
		dispatch(
			TOGGLE_LOCALED({
				locale: target
			})
		);
	};
	const selectLanguageMenu = <Menu onClick={toggleLanguage} mode="vertical" items={menuItems} />;
	return (
		<Row>
			<Col span={8}>col-8</Col>
			<Col span={8} offset={8} style={{ background: '#fff' }}>
				<Dropdown overlay={selectLanguageMenu} trigger={['click']}>
					<LanguageSvg />
				</Dropdown>
			</Col>
		</Row>
	);
}
