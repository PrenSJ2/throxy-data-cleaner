This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Design thinking

1. init the nextjs project with shadcn and the Data Table component
2. add the utils for superbase


## TODO
- [ ] add shadcn, supabase, and nextjs
- [ ] create database schema
- [ ] create basic langchain flow
- [ ] create a form to upload csv files
- [ ] create a data table to show the cleaned data
- [ ] add filters to the data table
- [ ] create a sidebar with a list of projects
- [ ] create a page to show the project details and the cleaned data
- [ ] expose api endpoints
- [ ] handle duplicates in uploads or rows


## Data cleaning issues
- data in correct columns
- remove unnecessary punctuation in company names
- remove spaces from domains and make lowercase
- change country names from short to full english names
- extra column / key `raw_json` to store the original row data


## Design
- shadcn dashboard
- in sidebar and homepage + button to form
- form to upload csv for cleaning, form to contain dropzone and a couple inputs for project name
- new project will then appear in the sidebar
- when clicking on the project, it will open a new page with the project name and a data table showing the cleaned data
- project data table should have 3 filters: country, employee_size and domain