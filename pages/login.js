import React, { useState } from "react";
import firebaseClient from "../firebaseClient";
import firebase from "firebase/app";
import "firebase/auth";

export default function Login({ props }) {
  firebaseClient();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <section className="hero">
      <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-5-tablet is-5-desktop is-5-widescreen">
              <div action="" className="box">
                <h1 className="title has-text-centered">Login</h1>
                <div className="field">
                  <label htmlFor="" className="label">Email</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="email"
                      onChange={(e) => setEmail(e.target.value)}
                      id="emailAddress"
                      value={email}
                      aria-describedby="email-helper-text"
                      placeholder="bobross@email.com"
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-envelope"></i>
                    </span>
                  </div>
                </div>
                <div className="field mt-4">
                  <label htmlFor="" className="label">Password</label>
                  <div className="control has-icons-left">
                    <input
                      className="input"
                      type="password"
                      onChange={(e) => setPass(e.target.value)}
                      id="pass"
                      value={pass}
                      id="password"
                      placeholder="Enter your password"
                    />
                    <span className="icon is-small is-left">
                      <i className="fa fa-lock"></i>
                    </span>
                  </div>
                </div>
                <div className="field mt-4">
                  <button
                    className="button is-info"
                    onClick={async () => {
                      await firebase
                        .auth()
                        .signInWithEmailAndPassword(email, pass)
                        .then(function (firebaseUser) {
                          window.location.href = "/";
                        })
                        .catch(function (error) {
                          const message = error.message;
                          console.log(message)
                        });
                    }}
                  >
                    Log in
               </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
