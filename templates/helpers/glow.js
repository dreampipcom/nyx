export function parseLocaleFromPath() {
  // Get the current URL path
  const path = window.location.pathname;
  const matches = path.split('/');
  if (matches && matches[1]) {
    return matches[1];
  }
  return 'en'; // Default to English if no locale is found
}

export const consentLocales = {
  'en': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `To use DreamPip you need to accept to both our Privacy Policy and Terms of Service. <br /><br /> Our terms of service, in a nutshell, are: <br /><br />🧓 you are over 18 years; <br />📽 you can't record/download whatever is not on Mixcloud <br />`,
    bannerLinkText: '<br />Legal Page.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Do you accept?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Accept',
    rejectBtnTxt: 'Reject'
  },
  'it-it': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Per utilizzare DreamPip devi accettare sia la nostra Informativa sulla Privacy che i Termini di Servizio. <br /><br /> I nostri termini di servizio, in breve, sono: <br /><br />🧓 hai più di 18 anni; <br />📽 non puoi registrare/scaricare ciò che non è su Mixcloud <br />`,
    bannerLinkText: '<br />Pagina Legale.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Accetti?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Accetta',
    rejectBtnTxt: 'Rifiuta'
  },
  'pt-br': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Para usar o DreamPip, você precisa aceitar tanto a nossa Política de Privacidade quanto os Termos de Serviço. <br /><br /> Nossos termos de serviço, resumindo, são: <br /><br />🧓 você tem mais de 18 anos; <br />📽 você não pode gravar/baixar o que não está no Mixcloud <br />`,
    bannerLinkText: '<br />Página Legal.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Você aceita?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Aceitar',
    rejectBtnTxt: 'Rejeitar'
  },
  'es-es': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Para usar DreamPip necesitas aceptar tanto nuestra Política de Privacidad como los Términos de Servicio. <br /><br /> Nuestros términos de servicio, en resumen, son: <br /><br />🧓 tienes más de 18 años; <br />📽 no puedes grabar/descargar lo que no está en Mixcloud <br />`,
    bannerLinkText: '<br />Página Legal.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">¿Aceptas?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Aceptar',
    rejectBtnTxt: 'Rechazar'
  },
  'de-de': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Um DreamPip zu nutzen, müssen Sie sowohl unsere Datenschutzrichtlinie als auch unsere Nutzungsbedingungen akzeptieren. <br /><br /> Unsere Nutzungsbedingungen kurz gefasst sind: <br /><br />🧓 Sie sind über 18 Jahre alt; <br />📽 Sie dürfen nichts aufnehmen/herunterladen, was nicht auf Mixcloud ist <br />`,
    bannerLinkText: '<br />Rechtsseite.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Akzeptieren Sie?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Akzeptieren',
    rejectBtnTxt: 'Ablehnen'
  },
  'fr-fr': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Pour utiliser DreamPip, vous devez accepter à la fois notre Politique de Confidentialité et nos Conditions d'Utilisation. <br /><br /> Nos conditions d'utilisation, en bref, sont : <br /><br />🧓 vous avez plus de 18 ans; <br />📽 vous ne pouvez pas enregistrer/télécharger ce qui n'est pas sur Mixcloud <br />`,
    bannerLinkText: '<br />Page Légale.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Acceptez-vous?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Accepter',
    rejectBtnTxt: 'Rejeter'
  },
  'ro': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Pentru a folosi DreamPip, trebuie să accepți atât Politica noastră de Confidențialitate cât și Termenii de Serviciu. <br /><br /> Termenii noștri de serviciu, pe scurt, sunt: <br /><br />🧓 ai peste 18 ani; <br />📽 nu poți înregistra/descărca ceea ce nu este pe Mixcloud <br />`,
    bannerLinkText: '<br />Pagina Legală.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Accepți?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Acceptă',
    rejectBtnTxt: 'Respinge'
  },
  'pl-pl': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Aby korzystać z DreamPip, musisz zaakceptować zarówno naszą Politykę Prywatności, jak i Regulamin. <br /><br /> Nasz regulamin, w skrócie, mówi, że: <br /><br />🧓 masz powyżej 18 lat; <br />📽 nie możesz nagrywać/pobierać tego, czego nie ma na Mixcloud <br />`,
    bannerLinkText: '<br />Strona prawna.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Akceptujesz?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Akceptuj',
    rejectBtnTxt: 'Odrzuć'
  },
  'cs-cz': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `Pro použití DreamPip musíte přijmout jak naše Zásady ochrany osobních údajů, tak i Obchodní podmínky. <br /><br /> Naše obchodní podmínky v kostce jsou: <br /><br />🧓 je vám více než 18 let; <br />📽 nemůžete nahrávat/stahovat to, co není na Mixcloud <br />`,
    bannerLinkText: '<br />Právní stránka.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Souhlasíte?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Souhlasím',
    rejectBtnTxt: 'Odmítnout'
  },
  'sv-se': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `För att använda DreamPip måste du acceptera både vår Integritetspolicy och Användarvillkor. <br /><br /> Våra användarvillkor, i korthet, är: <br /><br />🧓 du är över 18 år; <br />📽 du kan inte spela in/ladda ner det som inte finns på Mixcloud <br />`,
    bannerLinkText: '<br />Juridisk sida.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Accepterar du?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Acceptera',
    rejectBtnTxt: 'Avvisa'
  },
  'et-ee': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `DreamPip kasutamiseks peate nõustuma nii meie Privaatsuspoliitika kui ka Teenuse Tingimustega. <br /><br /> Meie teenuse tingimused lühidalt on: <br /><br />🧓 olete üle 18 aasta vana; <br />📽 te ei tohi salvestada/allalaadida seda, mis pole Mixcloudis <br />`,
    bannerLinkText: '<br />Juriidiline leht.',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">Kas nõustute?</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: 'Nõustu',
    rejectBtnTxt: 'Lükka tagasi'
  },
  'ja-jp': {
    policyLink: '/privacy',
    hideAfterClick: true,
    bannerDescription: `DreamPipを使用するには、私たちのプライバシーポリシーと利用規約の両方に同意する必要があります。<br /><br /> その利用規約の要点は以下のとおりです：<br /><br />🧓 18歳以上であること； <br />📽 Mixcloudにないものを録音/ダウンロードすることはできません <br />`,
    bannerLinkText: '<br />法的ページ。',
    bannerBackground: '#1a1a1a',
    bannerColor: '#ffffff',
    bannerHeading: '<h3 style="color: white; margin-top: 0;">同意しますか？</h3>',
    acceptBtnBackground: '#f8f8f8',
    acceptBtnColor: '#1a1a1a',
    analytics: 'UA-53455506-5',
    acceptBtnTxt: '同意する',
    rejectBtnTxt: '拒否'
  }
};