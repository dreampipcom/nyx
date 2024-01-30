import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`  
  body {
      font-weight: 300;
      hyphens: auto;
      word-break: break-word;
      word-wrap: break-word;
  }
  
  h1, h2, h3, h4, h5, h6 {
      font-weight: 400;
      line-height: 1.2;
      margin-bottom: 0.5em;

  }
  
  h1 {
    font-size: 32px;

    @media screen and (min-width: 768px) {
      font-size: 48px;
    }
  }
  
  h2 {
      font-size: 1.8em;
  }
  
  h3 {
      font-size: 1.3em;
  }
  
  h4 {
      font-size: .8em;
  }
  
  h5 {
      font-size: 1.1em;
  }
  
  h6 {
      font-size: 1em;
  }
  
  p {
      margin-bottom: 1.2em;
    letter-spacing: .1em;
    word-spacing: .005em;
  }
  

  .square {
    aspect-ratio: 9 / 9;
    width: 100%;
    object-fit: cover;
  }

  .landscape {
    aspect-ratio: 16 / 9;
    width: 100%;
    object-fit: cover;
  }

  .portrait {
    aspect-ratio: 9 / 16;
    width: 100%;
    object-fit: cover;
  }

  .a3 {
    aspect-ratio: 1 / 1.4142;
    width: 100%;
    object-fit: cover;
  }


  body {
	color: #fff;
	font-size: 18px;
	line-height: 1.6;
}

.content {
  width: 100%;
  overflow: hidden;
  background-color: #1a1a1a;
  color: #fff !important;
}

.content-page .wrap,
.content-single .wrap,
.content-index .wrap {
	padding: 32px;
}

@media screen and (min-width: 1440px) {
	.wrap {
		padding: 0;
	}

	.content-page .wrap,
	.content-single .wrap,
	.content-index .wrap {
		padding: 72px;
	}
}

.content .button {
	background-color: #858585;
	border-radius: 4px;
	color: #ffffff;
	cursor: pointer;
	display: inline-block;
	float: left;
	font-weight: 400;
	padding: 12px 24px;
	text-align: center;
	text-decoration: none;
	margin-right: 8px;
}

.content .button:focus,
.content .button:hover {
	background-color: #999999;
}

.content .button-secondary {
	background-color: #fff;
	color: #1c1c1c;
}

.content .button-secondary:focus,
.content .button-secondary:hover {
	background-color: darken(#fff, 10);
}

.pagination ul {
	list-style-type: none;
	margin: 0;
	padding: 0;
}

.pagination.has-next.has-previous ul {
	column-count: 2;
}

.pagination-next {
	text-align: right;
}

.wrap {
	margin: 0 auto;
	overflow: auto;
	padding: 64px 32px;
	position: relative;
	z-index: 1;
  max-width: 1440px;
}


/* CUSTOM CLASSES */
.glowCookies__border {
  border: 1px solid #e6e6e6 !important;
}

.glowCookies__left {
  left: 15px;
}

.glowCookies__right {
  right: 15px;
}

.glowCookies__show {
  opacity: 1 !important;
  visibility: visible !important;
  transform: translateX(-50%) scale(1) !important;
}

/* COMMON STYLES */
/* ========================= */
.glowCookies__banner {
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) scale(0.9);
  font-family: inherit;
  position: fixed;
  left: 50%;
  width: 100%;
  margin: 0;
  max-width: 375px;
  z-index: 999;
  -webkit-box-shadow: 0 .625em 1.875em rgba(2,2,3,.2);
  -moz-box-shadow: 0 .625em 1.875em rgba(2,2,3,.2);
  box-shadow: 0 .625em 1.875em rgba(2,2,3,.2);
  transition: transform .2s ease, opacity .2s ease !important;
}

.glowCookies__banner .accept__btn__styles {
  border: none;
  padding: 13px 15px;
  font-size: 15px;
  font-family: inherit;
  width: 49%;
  cursor: pointer;
  font-weight: bolder;
  transition: filter 0.15s;
  user-select: none;
}

.glowCookies__banner .settings__btn__styles {
  border: none;
  padding: 13px 15px;
  font-family: inherit;
  font-size: 15px;
  width: 49%;
  cursor: pointer;
  font-weight: bolder;
  transition: filter 0.15s;
  user-select: none;
}

.glowCookies__banner .btn__section button:focus {
  outline: none;
  transform: scale(0.95);
  -webkit-filter: contrast(75%);
  filter: contrast(75%);
}

.glowCookies__banner .btn__section button:hover {
  -webkit-filter: contrast(85%);
  filter: contrast(85%);
}

@media (max-width: 455px) {
  .btn__section .btn__accept {
    width: 100%;
    margin-bottom: 7px;
  }

  .btn__section .btn__settings {
      width: 100%;
  }
}

/* BANNER STYLE 1 */
/* ========================= */
.glowCookies__banner__1 {
  bottom: 15px;
  border-radius: 20px;
  padding: 20px 25px;
}

.glowCookies__banner__1 > h3 {
  font-size: 24px;
  margin: 0px;
  padding: 8px 0;
}

.glowCookies__banner__1 > p {
  font-size: 15px;
  margin: 0px;
  padding: 0px;
  line-height: 1.3;
}

.glowCookies__banner__1 .read__more {
  font-weight: bolder;
}

.glowCookies__banner__1 .read__more:hover {
  color: #666666;
}

.glowCookies__banner__1 .btn__section {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 20px;
}

.glowCookies__banner__1 .btn__section button {
  border-radius: 10px;
}

@media (max-width: 455px) {
  .glowCookies__banner__1 {
      right: 0px;
      margin: 7px;
  }

  .glowCookies__banner__1 .btn__section {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 20px;
  }
}


/* BANNER STYLE 2 */
/* ========================= */
.glowCookies__banner__2 {
  bottom: 15px;
  border-radius: 5px;
  padding: 25px 35px;
}

.glowCookies__banner__2 > h3 {
  font-size: 24px;
  margin: 0px;
  padding: 8px 0;
}

.glowCookies__banner__2 > p {
  font-size: 15px;
  margin: 0px;
  padding: 0px;
  line-height: 1.3;
}

.glowCookies__banner__2 .read__more {
  font-weight: bolder;
}

.glowCookies__banner__2 .read__more:hover {
  opacity: 0.8;
}

.glowCookies__banner__2 .btn__section {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 20px;
}

.glowCookies__banner__2 .btn__section button {
  border-radius: 5px;
}

@media (max-width: 455px) {
  .glowCookies__banner__2 {
      right: 0px;
      border-radius: 0px;
      border: 0px;
      max-width: 550px;
      width: 99%;
  }

  .glowCookies__banner__2 .btn__section {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 20px;
  }
}

/* BANNER STYLE 3 */
/* ========================= */
.glowCookies__banner__3 {
  bottom: 15px;
  border-radius: 0px;
  padding: 25px 35px;
}

.glowCookies__banner__3 > h3 {
  font-size: 30px;
  margin: 0px;
  padding: 8px 0;
}

.glowCookies__banner__3 > p {
  font-size: 15px;
  margin: 0px;
  padding: 0px;
  line-height: 1.3;
}

.glowCookies__banner__3 .read__more {
  font-weight: bolder;
}

.glowCookies__banner__3 .read__more:hover {
  opacity: 0.8;
}

.glowCookies__banner__3 .btn__section {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-top: 25px;
}

.glowCookies__banner__3 .btn__section button {
  border-radius: 0px;
}

@media (max-width: 455px) {
  .glowCookies__banner__3 {
      right: 0px;
      border-radius: 0px;
      border: 0px;
      max-width: 550px;
  }

  .glowCookies__banner__3 .btn__section {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-top: 20px;
  }
}

/* Prebanner styles */
/* =========================== */
.prebanner {
  position: fixed;
  bottom: 15px;
  z-index: 999;
  min-height: 50px;
  min-width: 125px;
  cursor: pointer;
  font-family: inherit;
  font-size: 15px;
  font-weight: bolder;
  line-height: normal;
  border: none;
  padding: 12px 18px;
  text-decoration: none;
  user-select: none;
  -webkit-box-shadow: 0 .625em 1.875em rgba(2,2,3,.1);
  -moz-box-shadow: 0 .625em 1.875em rgba(2,2,3,.1);
  box-shadow: 0 .625em 1.875em rgba(2,2,3,.1);
}

.prebanner__border__1 {
  border-radius: 15px;
}

.prebanner__border__2 {
  border-radius: 10px;
}

.prebanner__border__3 {
  border-radius: 2px;
}

.animation {
  transition: .2s;
}

.animation:hover {
  transform: scale(.97);
}

.prebanner:hover {
  text-decoration: none;
}

.mapbox-purizu-custom {

  .mapboxgl-popup-content {
    background-color: #1a1a1a;
  }

  .mapboxgl-popup-close-button {
    display: none;
  }
}

.mapboxgl-popup-anchor-top {
  .mapboxgl-popup-tip  {
    border-bottom-color: #1a1a1a;
  }
}

.mapboxgl-popup-anchor-top-right {
  .mapboxgl-popup-tip  {
    border-bottom-color: #1a1a1a;
  }
}

.mapboxgl-popup-anchor-top-left {
  .mapboxgl-popup-tip  {
    border-bottom-color: #1a1a1a;
  }
}

.mapboxgl-popup-anchor-bottom {
  .mapboxgl-popup-tip  {
    border-top-color: #1a1a1a;
  }
}

.mapboxgl-popup-anchor-bottom-left {
  .mapboxgl-popup-tip  {
    border-top-color: #1a1a1a;
  }
}

.mapboxgl-popup-anchor-bottom-right {
  .mapboxgl-popup-tip  {
    border-top-color: #1a1a1a;
  }
}


.mapboxgl-popup-anchor-left {
  .mapboxgl-popup-tip  {
    border-right-color: #1a1a1a;
  }
}

.mapboxgl-popup-anchor-right {
  .mapboxgl-popup-tip  {
    border-left-color: #1a1a1a;
  }
}

.mapboxgl-map {
  font-family: unset;
}

.fc .fc-button-primary {
    background: none;
    border-color: white;
    border-radius: 0;
    color: white;
    margin: 8px;

    &:disabled, .fc .fc-button-primary:not(:disabled).fc-button-active {
      border-color: white;
      background-color: gray;
    }

    &:hover {
      background-color: lightgray;
      color: black;
    }
}

.fc-direction-ltr {
  min-height: 500px;
}

.fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active {
  border-color: white;
  background-color: white;
  color: black;
}

.fc-direction-ltr .fc-toolbar > * > :not(:first-child) {
  margin-left: 0;
}

`;

export default GlobalStyle;