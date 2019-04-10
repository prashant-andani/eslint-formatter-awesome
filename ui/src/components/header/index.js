import { h } from 'preact';
import { Link } from 'preact-router/match';
import style from './style';

const Header = () => (
	<header class={style.header}>
		<h1>ESLint</h1>
	</header>
);

export default Header;
