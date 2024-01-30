
{
  "@context": "https://schema.org",
    "@type": "Event",
      "name": "${event?.title}",
        "description": "${`${localization['when']}: ${localWhen}, ${localization['country']}: ${country}, ${localization['city']}: ${event?.city}, ${localization['artists']}: ${artists}`}",
          "image": "${event?.image?.url}",
            "startDate": "${event?.date}",
              "endDate": "${event?.end}",
                "eventStatus": "${eventStatusSchema[event?.status] || 'https://schema.org/EventScheduled'}",
                  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
                    "location": {
    "@type": "Place",
      "name": "${event?.venue}",
        "address": {
      "@type": "PostalAddress",
        "streetAddress": "${event?.street}",
          "addressLocality": "${event?.city}",
            "postalCode": "${event?.postalCode}",
              "addressCountry": "${event?.country}"
    }
  },
  "organizer": {
    "@type": "Organization",
      "name": "Remometro",
        "url": "https://www.remometro.com"
  },
  "performer": [
    ${ event?.artistsCollection?.items?.map((artist) => {
      return `
                  {
                    "@type": "Person",
                    "name": "${artist?.name}"
                  }
                  `
    }).join(',')}]
            ${
  (event?.ticketsSchema ||
    event?.ticketsSchema2 ||
    event?.ticketsSchema3 ||
    event?.ticketsSchema4) ? `,
              "offers": [
                ${JSON.stringify(event?.ticketsSchema?.offers || {})},
                ${event?.ticketsSchema2 ? JSON.stringify(event?.ticketsSchema2?.offers || {}) + ',' : ','}
                ${event?.ticketsSchema3 ? JSON.stringify(event?.ticketsSchema3?.offers || {}) + ',' : ','}
                ${event?.ticketsSchema4 ? JSON.stringify(event?.ticketsSchema4?.offers || {}) + '' : ''}
              ]
              ` : ``
}
