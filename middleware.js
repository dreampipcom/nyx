import acceptLanguage from "accept-language";
import { NextResponse } from "next/server";
import { MAP_CENTRES } from "./lib/constants";
import { localeMap } from "./lib/cjs-constants";

const supportedLocales = ["en", "it-IT", "pt-BR", "it", "pt", "ro"];

acceptLanguage.languages(supportedLocales);


function calculateDistance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1 / 180
    var radlat2 = Math.PI * lat2 / 180
    var radlon1 = Math.PI * lon1 / 180
    var radlon2 = Math.PI * lon2 / 180
    var theta = lon1 - lon2
    var radtheta = Math.PI * theta / 180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180 / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == "K") { dist = dist * 1.609344 }
    if (unit == "N") { dist = dist * 0.8684 }
    return dist
}

export let middleware = (request) => {
    const geo = request.geo
    if(request.nextUrl.pathname === '/agenda' && (geo?.latitude || geo?.city)) {
        const cities = Object.keys(MAP_CENTRES)
        const centres = Object.values(MAP_CENTRES)
        const newUrl = request.nextUrl.clone();

        if(cities.includes(geo.city.toLowerCase())) {
            newUrl.pathname = `/agenda/${geo.city.toLowerCase()}`

            return NextResponse.redirect(newUrl);
        }

        for (let i = 0; i < centres.length; i++) {
            const distance = calculateDistance(geo.latitute,geo.longitude, centres[i].coordinates[0], centres[i].coordinates[1], "K");
            centres[i]["distance"] = distance
        }
        
        const closest = centres.sort(function (a, b) {
            return a.distance - b.distance;
        })[0];

        
        newUrl.pathname = `/agenda/${closest.slug}`

        return NextResponse.redirect(newUrl);
    }
    if (
        !/\.(.*)$/.test(request.nextUrl.pathname) &&
        request.nextUrl.locale === "default"
    ) {

        const newUrl = request.nextUrl.clone();
        const headers = request.headers.get("accept-language")

        if (!headers) return NextResponse.rewrite(newUrl)
        const savedLocale = request.cookies.get('NEXT_LOCALE')
        const newlocale = savedLocale?.value || acceptLanguage.get(headers).toLocaleLowerCase() || "en";
        newUrl.locale = localeMap[newlocale] || newlocale

        return NextResponse.redirect(newUrl);
    }

    return undefined;
};

export const config = {
    matcher: [
        '/((?!app|.well-known|api|favicon.ico|fonts|images|scripts|og-image.png|sitemap|robots|_next|en|it-it|pt-br|es-es|de-de|fr-fr|ro|pl-pl|cs-cz|sv-se|et-ee|ja-jp).*)/',
    ],
}
