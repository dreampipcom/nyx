License: © Purizu di Angelo Reale

Authors: varsnothing aka Angelo Reale

This repo is just an exercise on some engineering design patterns. I've used Next.js new pragma (App Router) to apply them, so that I could also learn that new way of using Next.js.

I didn't use Co-Pilot, nor ChatGPT. I use Sublime and Tmux. What is auto-suggestion and intelli-sense?

After a few weeks without coding, I have to say I should have been less eager to try so many new things/technologies/patterns in such a short timeframe, as that has definitely impacted my velocity and workflow. Also, TypeScript can slow things down when I'm out of stretch.

Nonetheless, I think I had a good opportunity to use a few of the things I like the most (DRY, YAGNI, KISS, SOLID, MVC, Singleton, Decorator, Curry, Flux, Interface, Gateway and other patterns). At the end I even thought of using Mutex for optimization on the context, but maybe next time.

I'm looking for a new job, and you can check my CV / book some time with me here: https://angeloreale.com


Why Libs?

react

```
react is an industry standard, that leverages a virtual dom to simulate user and server interactions, commiting those changes to the actual dom in the form of rendering abstractions, where nodes get hydrated with the latest state of an application
```

react/context-api

```
flux pattern is a great way to make sure any application running keeps a solid and reliable history of the actions taken by the user/server. i've tried to mimic this pattern, mostly used from tools like redux, using solely the context api, thus, breaking the state into different, isolated context/providers, and creating/enforcing a flux workflow to prevent state mismatches and unnecessary re-renders.
```

nextjs

```
it's a great and simple framework for creating csr/ssr/ssg/isr applications, with a syntax pragma that works really well with Vercel. a great tool i use for infrastructure at low/zero cost.
```

nextauth

```
it's the standard tool for simplifying auth flows in next.js
```

typescript

```
it helps with little bugs that may creep into a fast evolving app
```

mongo

```
flexible, easy to use with javascript, although with my implementation i've enforced a schema in a mongoose-esque way, to ensure there are less of the aforementioned TypeError bugs.
```

nodemailer

```
just a tool to send emails via node, useful for our passworldless login.
```

clsx

```
the tinies lib for adding business logic to css without any bootstrap, js-in-css or other jsx pragmas/css tools/preprocessors. i've used css modules for treeshaking and reducing bundle size.
```

prettier

```
nice to keep the code clean and consistent when it comes to syntax
```

eslint

```
good to catch multiple types of dark patterns.
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
