# ReactJs + Tailwind CSS Example

This example shows how to use [Tailwind CSS](https://tailwindcss.com/) [(v3.0)](https://tailwindcss.com/blog/tailwindcss-v3) with Next.js. It follows the steps outlined in the official [Tailwind docs](https://tailwindcss.com/docs/guides/nextjs).

## Preview

Preview the example live on [StackBlitz](http://stackblitz.com/):

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/vercel/next.js/tree/canary/examples/with-tailwindcss)

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vercel/next.js/tree/canary/examples/with-tailwindcss&project-name=with-tailwindcss&repository-name=with-tailwindcss)

## Folder Structure

├── public/ # Distribution files
│ └── images/ # Image directory
│
├── src/ # Source files
│ │
│ │── components/
│ │ ├── features/ # Projects features components like tabs
│ │ │  
│ │ ├── layouts/ # Project layout components i.e. page wrappers,menu,footers,blog layouts, etc
│ │ │
│ │ ├── pages/ # Project distinct pages Components (each page contains it's section folder)
│ │ │  
│ │ ├── ui/ # Project ui components i.e. Button
│ │ │
│ │ └── utils/ # any component that does not fit in any of the above grouping
│ │
│ │── data/ #project data i.e. JSON files/helper/data types manipulation methods
│ │
│ │── lib/ # project special methods/function
│ │
│ │── store/ # context/redux
│ │
│ │── routes/ # specific pages routes
│ │
│ └── server/ # All server specific helpers i.e. config for apollo/react query
│
└── index.html

## How to use

Execute [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) or [Yarn](https://yarnpkg.com/lang/en/docs/cli/create/) to bootstrap the example:

```bash
npx create-next-app --example with-tailwindcss with-tailwindcss-app
# or
yarn create next-app --example with-tailwindcss with-tailwindcss-app
```

Deploy it to the cloud with [Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example) ([Documentation](https://nextjs.org/docs/deployment)).
