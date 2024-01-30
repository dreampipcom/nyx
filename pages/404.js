import React from 'react';
import { Template } from '../templates';
export default function Page404() {
  return <article className="content-page">
    <section className="wrap bg-gray" style={{ marginBottom: '80px' }}>
      <h1>404: We couldn't tune to this frequency.</h1>
    </section>
  </article>;
}

Page404.getLayout = function getLayout(page) {
  return (
    <Template>
      {page}
    </Template>
  )
}