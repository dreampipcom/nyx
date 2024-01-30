import { createGlobalStyle } from 'styled-components';
 
const HeadStyle = createGlobalStyle`
.hero {
	background-color: #333333;
	background-position: 48% 72%;
	background-size: cover;
	background-repeat: no-repeat;
	color: #fff;
	padding: 0;
	position: relative;
}

@media screen and (min-width: $content-width) {
	.wrap {
		padding: 0;
	}
}

.hero::before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: inherit;
	opacity: 0.8;
	z-index: 1;
}

.hero a {
	color: #fff;
}

.children a:focus,
.children a:hover {
	color: #333;
}

@media screen and (min-width: $breakpoint-medium) {
	.hero h1 {
		max-width: 80%;
	}

	.intro {
		margin-bottom: 2%;
		max-width: 50%;
	}
}
`;
 
export default HeadStyle;