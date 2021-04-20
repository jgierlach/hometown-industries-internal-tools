import React, { useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '../auth';
// import LoadingAnimation from "../components/LoadingAnimation"

export default function Home() {
  const { user } = useAuth();
  if (user) {
    return (
      <div className="mt-4 container">
        <h1 className="title has-text-centered">
          Welcome, {`${user ? user.email.split('@')[0] : 'email not found'
            }`}
        </h1>
        <h3 className="title is-4 has-text-centered">Would you like to.....</h3>

        <div className="tile is-ancestor mt-4">
          <div className="tile is-parent">
            <article className="tile is-child box">
              <p className="title is-4">Scrape Amazon SERP for asins</p>
              <p className="subtitle">Pull lists of asins from Amazon search and download in CSV format.</p>
              <Link href="/amazonserp">
                <button className="button is-small is-info is-rounded">Check it out</button>
              </Link>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child box">
              <p className="title is-4">Scrape rank and listing specific data by asin</p>
              <p className="subtitle">Look at rank data and estimate revenue for an individual/list of asins.</p>
              <Link href="/revenuebyasins">
                <button className="button is-small is-info is-rounded">Check it out</button>
              </Link>
            </article>
          </div>
          <div className="tile is-parent">
            <article className="tile is-child box">
              <p className="title is-4">Scrape Rank data from H10 txt files</p>
              <p className="subtitle">Find historic rank for an asin by parsing H10 txt files.</p>
              <Link href="/scraperank">
                <button className="button is-small is-info is-rounded">Check it out</button>
              </Link>
            </article>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <h1 className="has-text-centered title mt-4">Please <Link href="/login">Login</Link> to your account.</h1>
    )
  }
}
