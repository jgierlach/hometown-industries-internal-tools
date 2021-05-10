import React from 'react'
import Link from 'next/link'
import { useAuth } from '../auth'
import firebase from 'firebase/app'

const Navbar = () => {
  const { user } = useAuth()
  if (user) {
    return (
      <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <Link href="/"><a className="navbar-item">Home</a></Link>
            <Link href="/amazonserp"><a className="navbar-item">Amazon Search</a></Link>
            <Link href="/revenuebyasins"><a className="navbar-item">Revenue By ASINs</a></Link>
            <Link href="/allasinsforseller"><a className="navbar-item">Fetch All Asins For Seller</a></Link>
            {/* <Link href="/scraperank"><a className="navbar-item">Scrape Rank From File</a></Link> */}
            {/* <Link href="/monitorasins"><a className="navbar-item">Monitor Asins</a></Link> */}
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <button
                  type="button"
                  onClick={async () => {
                    await firebase.auth().signOut();
                    window.location.href = '/login';
                  }}
                  style={{ background: 'white' }}
                  className="button is-light"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  } else {
    return (
      <nav className="navbar is-primary" role="navigation" aria-label="main navigation">
        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons">
                <Link href="/login">
                  <a style={{ background: 'white' }} className="button is-light">Login</a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    )
  }
}

export default Navbar;
