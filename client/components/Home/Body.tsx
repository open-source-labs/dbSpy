import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { BrandGithub, BrandLinkedin } from 'tabler-icons-react';

import logo from '../../assets/logo1.png';
import gif from '../../assets/SQL.gif';

export default function Body() {
  const date = new Date().getFullYear();

  return (
    <>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
          crossOrigin="anonymous"
        />

        {/* <link rel="canonical" href="https://getbootstrap.com/docs/5.2/examples/carousel/"/> */}

        {/*<style>
       {const bd-placeholder-img = {
        fontSize: "1.125rem";
        textAnchor: "middle";
        webkitUserSelect: "none";
        mozUserSelect: "none";
        userSelect: "none";
      }}

      @media (min-width: 768px) {
        .bd-placeholder-img-lg {
          font-size: 3.5rem;
        }
      }

      .b-example-divider {
        height: 3rem;
        background-color: rgba(0, 0, 0, .1);
        border: solid rgba(0, 0, 0, .15);
        border-width: 1px 0;
        box-shadow: inset 0 .5em 1.5em rgba(0, 0, 0, .1), inset 0 .125em .5em rgba(0, 0, 0, .15);
      }

      .b-example-vr {
        flex-shrink: 0;
        width: 1.5rem;
        height: 100vh;
      }

      .bi {
        vertical-align: -.125em;
        fill: currentColor;
      }

      .nav-scroller {
        position: relative;
        z-index: 2;
        height: 2.75rem;
        overflow-y: hidden;
      }

      .nav-scroller .nav {
        display: flex;
        flex-wrap: nowrap;
        padding-bottom: 1rem;
        margin-top: -1px;
        overflow-x: auto;
        text-align: center;
        white-space: nowrap;
        -webkit-overflow-scrolling: touch;
      }
    </style>*/}

        {/* <link href="carousel.css" rel="stylesheet"/> */}
      </head>
      <body style={{ backgroundColor: 'whitesmoke' }}>
        <main>
          <div className="container marketing">
            {/* <!-- START THE FEATURETTES --> */}
            {/* dbSpy intro */}
            <div className="row featurette" style={{ padding: '50' }}>
              <div
                className="col-md-6"
                style={{ textAlign: 'left', margin: 'auto' }}
              >
                <h2
                  className="featurette-heading fw-normal lh-2"
                  style={{ lineHeight: '2' }}
                >
                  Database development simplified{' '}
                </h2>
                <h4
                  className="text-muted"
                  style={{ fontWeight: '400', lineHeight: '1.5' }}
                >
                  dbSpy is an open-source tool to facilitate relational database
                  development. It's the only tool you need to visualize, modify,
                  and build your database.
                </h4>
              </div>
              <div className="col-md-6" style={{ margin: 'auto' }}>
                <img style={{ width: '100%' }} src={logo} alt="dbSpy logo" />
              </div>
            </div>

            <hr className="featurette-divider" />

            {/* dbSpy gif */}
            <div className="row featurette" style={{ padding: '50' }}>
              <div
                className="col-md-7"
                style={{
                  padding: '50 0 50 0',
                  textAlign: 'left',
                  margin: 'auto',
                }}
              >
                <img
                  style={{
                    border: '1px solid black',
                    borderRadius: '5px',
                    width: '100%',
                  }}
                  src={
                    'https://user-images.githubusercontent.com/83368864/179806428-f73b2b18-b82b-4b19-8ea1-5af72ddd23d3.gif'
                  }
                  alt="dbSpy gif"
                />
              </div>

              <div
                className="col-md-5"
                style={{ margin: 'auto', textAlign: 'right' }}
              >
                <h2 className="featurette-heading fw-normal lh-1">
                  Key features{' '}
                </h2>
                <h4
                  className=" text-muted"
                  style={{ fontWeight: '400', lineHeight: '2' }}
                >
                  Database connection
                  <br />
                  Schema modification
                  <br />
                  SQL query generator
                  <br />
                  ER diagrams
                  <br />
                  and much more!
                </h4>
              </div>
            </div>

            {/* <div className="row featurette" style={{ padding: "50 0 50 0" }}>
              <div className="col-md-7">
                
              <div className="col-md-5" style={{padding: '50', textAlign: 'right'}}>
                <h2 className="featurette-heading fw-normal lh-1">
                  Key features{' '}
                </h2>
                <h3 className=" text-muted" style={{fontWeight: "400", lineHeight: "2"}}>
                  
                    Database connection
                    <br/>
                    Schema modification
                    <br/>
                    SQL query generator
                    <br/>
                    ER diagrams
                    <br/>
                    and much more!
                  
                </h3>
              </div>
              
            </div>

            <hr className="featurette-divider" />

            <div className="row featurette" style={{ padding: '50' }}>
              <div className="col-md-7">
                <h2 className="featurette-heading fw-normal lh-1">
                  Database development{' '}
                  <span className="text-muted">simplified.</span>
                </h2>
                <h3 className=" text-muted" style={{fontWeight: "400", lineHeight: "2"}}>
                  
                    Database connection
                    <br/>
                    Schema modification
                    <br/>
                    SQL query generator
                    <br/>
                    ER diagrams
                    <br/>
                    and much more!
                  
                </h3>
              </div>
              <div className="col-md-5">
                <svg
                  className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto"
                  width="500"
                  height="500"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Placeholder: 500x500"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill="#eee" />
                  <text x="50%" y="50%" fill="#aaa" dy=".3em">
                    500x500
                  </text>
                </svg>
              </div>
            </div> */}

            <hr className="featurette-divider" />

            {/* <!-- /END THE FEATURETTES --> */}
            <div className="row" style={{ padding: '50px 0' }}>
              <h2
                className="fw-normal"
                style={{ textAlign: 'center', marginBottom: '70px' }}
              >
                Meet the Team
              </h2>
              <div className="col-lg-3" style={{ textAlign: 'center' }}>
                <img
                  style={{ width: '140px', borderRadius: '50%' }}
                  src="https://avatars.githubusercontent.com/u/85323481?v=4"
                  alt="AngelGiron"
                />

                <h3 className="fw-normal" style={{ paddingTop: '10px' }}>
                  Angel Giron
                </h3>
                <p style={{ margin: '10px' }}>Software Engineer</p>
                <div style={{ marginBottom: '20px' }}>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://www.linkedin.com/in/acgiron/"
                    style={{ margin: '10px' }}
                  >
                    <BrandLinkedin
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://github.com/g94angel"
                    style={{ margin: '10px' }}
                  >
                    <BrandGithub
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                </div>
              </div>

              <div className="col-lg-3" style={{ textAlign: 'center' }}>
                <img
                  style={{ width: '140px', borderRadius: '50%' }}
                  src="https://avatars.githubusercontent.com/u/20432738?v=4"
                  alt="JohnPaulAdigwu"
                />

                <h3 className="fw-normal" style={{ paddingTop: '10px' }}>
                  John Paul Adigwu
                </h3>
                <p style={{ margin: '10px' }}>Software Engineer</p>
                <div style={{ marginBottom: '20px' }}>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://www.linkedin.com/in/johnpaul-adigwu/"
                    style={{ margin: '10px' }}
                  >
                    <BrandLinkedin
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://github.com/engineerous"
                    style={{ margin: '10px' }}
                  >
                    <BrandGithub
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                </div>
              </div>

              <div className="col-lg-3" style={{ textAlign: 'center' }}>
                <img
                  style={{ width: '140px', borderRadius: '50%' }}
                  src="https://avatars.githubusercontent.com/u/11093217?v=4"
                  alt="KevinParkLee"
                />

                <h3 className="fw-normal" style={{ paddingTop: '10px' }}>
                  Kevin Park-Lee
                </h3>
                <p style={{ margin: '10px' }}>Software Engineer</p>
                <div style={{ marginBottom: '20px' }}>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://www.linkedin.com/in/kevin38424/"
                    style={{ margin: '10px' }}
                  >
                    <BrandLinkedin
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://github.com/kevin38424"
                    style={{ margin: '10px' }}
                  >
                    <BrandGithub
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                </div>
              </div>

              <div className="col-lg-3" style={{ textAlign: 'center' }}>
                <img
                  style={{ width: '140px', borderRadius: '50%' }}
                  src="https://avatars.githubusercontent.com/u/83368864?v=4"
                  alt="TarikMokhtech"
                />

                <h3 className="fw-normal" style={{ paddingTop: '10px' }}>
                  Tarik Mokhtech
                </h3>
                <p style={{ margin: '10px' }}>Software Engineer</p>
                <div style={{ marginBottom: '20px' }}>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://www.linkedin.com/in/tarik-mokhtech/"
                    style={{ margin: '10px' }}
                  >
                    <BrandLinkedin
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                  <a
                    className="btn btn-dark btn-sm"
                    href="https://github.com/MockTech"
                    style={{ margin: '10px' }}
                  >
                    <BrandGithub
                      size={40}
                      strokeWidth={1.5}
                      color={'#FFFFFF'}
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* <!-- /.container --> */}

          {/* <hr className="featurette-divider" /> */}

          {/* <!-- FOOTER --> */}
          {/* <footer className="container" style={{color: "red"}}>
            <p className="float-end">
              <a style={{textDecoration: "none", color:"black", margin:"70px"}} href="#">Back to top</a>
            </p>
            <p>dbSpy {date} </p>
          </footer> */}
        </main>

        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa"
          crossOrigin="anonymous"
        ></script>
      </body>
    </>
  );
}
