import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "../auth";
import LoadingAnimation from "../components/LoadingAnimation"

export default function Home() {
  const { user } = useAuth();
  if (user) {
    return (
      <div className="mt-4 container">
        <h1 className="title has-text-centered">
          Welcome, {`${user ? user.email : "email not found"
            }`}
        </h1>
        <h3 className="title is-4 has-text-centered">Would you like to.....</h3>

        <div class="tile is-ancestor mt-4">
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title is-4">Scrape Amazon SERP for asins</p>
              <p class="subtitle">Pull lists of asins from Amazon search and download in CSV format.</p>
              <Link href="/amazonserp">
                <button className="button is-small is-info is-rounded">Check it out</button>
              </Link>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title is-4">Scrape rank and listing specific data by asin</p>
              <p class="subtitle">Look at rank data and estimate revenue for an individual/list of asins.</p>
              <Link href="/revenuebyasins">
                <button className="button is-small is-info is-rounded">Check it out</button>
              </Link>
            </article>
          </div>
          <div class="tile is-parent">
            <article class="tile is-child box">
              <p class="title is-4">Scrape Rank data from H10 txt files</p>
              <p class="subtitle">Find historic rank for an asin by parsing H10 txt files.</p>
              <Link href="/scraperank">
                <button className="button is-small is-info is-rounded">Check it out</button>
              </Link>
            </article>
          </div>
        </div>
      </div>
    );
  } else {
    return <LoadingAnimation />
  }
}
