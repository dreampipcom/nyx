import React from 'react';
import Bugsnag from '@bugsnag/js'
import BugsnagPluginReact from '@bugsnag/plugin-react'
import { Analytics } from '@vercel/analytics/react';
import "../scss/globals.tailwind.css"

Bugsnag.start({
  apiKey: '906cffb96843bd686d6044d2381cac27',
  plugins: [new BugsnagPluginReact()],
  enabledReleaseStages: ['production']
})

const ErrorBoundary = Bugsnag.getPlugin('react')
  .createErrorBoundary(React)


function App({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return getLayout(<ErrorBoundary><Component {...pageProps} /><Analytics /></ErrorBoundary>)
}

export default App;
