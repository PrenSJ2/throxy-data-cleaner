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

### Environment Variables

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
TAVILY_KEY=your_tavily_api_key
OPENAI_KEY=your_openai_api_key
```

# Design thinking

## TODO

- [x] add shadcn, supabase, and nextjs
- [x] create database schema
- [x] create basic langchain flow
- [x] create a form to upload csv files
- [x] create a data table to show the cleaned data
- [x] add filters to the data table
      ~~- [ ] create a sidebar with a list of projects~~
- [x] create a page to show the ~~project details~~ dashboard and the cleaned data
- [x] expose api endpoints
- [x] handle duplicates in uploads or rows

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

## Tradeoffs

- using heuristics to clean data instead of a full AI model
- separating uploads into different projects and so not having a single table for all data
- using tavily for search instead of relying on OpenAI for all search queries

## Extras

- tavily for search
- search for ceo, company value, stock ticker

## Future Improvements

- better tool or search for stock tickers
- fuzzy search for company names and domains
