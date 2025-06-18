### Throxy Data Cleaning App
By Sebastian Prentice
This is a simple data cleaning app built with Next.js, Shadcn, and Supabase. It allows users to upload CSV files, clean the data, and view the cleaned data in a table format. The app also provides basic filtering and AI capabilities.

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

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


##$ Design thinking

## TODO
- [X] add shadcn, supabase, and nextjs
- [X] create database schema
- [X] create basic langchain flow
- [X] create a form to upload csv files
- [X] create a data table to show the cleaned data
- [X] add filters to the data table
~~- [ ] create a sidebar with a list of projects~~
- [X] create a page to show the ~~project details~~ dashboard and the cleaned data
- [X] expose api endpoints
- [X] handle duplicates in uploads or rows


## Data cleaning issues
- data in correct columns
- remove unnecessary punctuation in company names
- remove spaces from domains and make lowercase
- change country names from short to full english names
- extra column / key `raw_json` to store the original row data


## Design
- main user flows: upload csv, view cleaned data, filter data
- upload form with drag and drop - dropzone quick upload
- dashboard with data table
- data table with filters

## Extras
- tavily for search
- search for ceo, company value, stock ticker


## Future Improvements
- better tool or search for stock tickers
- fuzzy search for company names and domains