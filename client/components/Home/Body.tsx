import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import {BrandGithub, BrandLinkedin} from "tabler-icons-react";
// import '../../../carousel.css';



export default function Body() {
  const date = new Date().getFullYear();

  return (
    <>
      <head>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx" crossOrigin="anonymous" />


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
      <body>

        {/* <header>
  <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
    <div className="container-fluid">
      <a className="navbar-brand" href="#">Carousel</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarCollapse">
        <ul className="navbar-nav me-auto mb-2 mb-md-0">
          <li className="nav-item">
            <a className="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled">Disabled</a>
          </li>
        </ul>
        <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
          <button className="btn btn-outline-success" type="submit">Search</button>
        </form>
      </div>
    </div>
  </nav>
</header> */}

        <main>
         

      


          {/* <!-- Marketing messaging and featurettes
  ================================================== -->
  <!-- Wrap the rest of the page in another container to center all the content. --> */}

          <div className="container marketing">
            
           


            {/* <!-- START THE FEATURETTES --> */}

            {/* <hr className="featurette-divider" /> */}

            <div className="row featurette" style={{ padding: "50"}}>
              <div className="col-md-7">
                <h2 className="featurette-heading fw-normal lh-1">First featurette heading. <span className="text-muted">It’ll blow your mind.</span></h2>
                <p className="lead">c habitasse platea dictumst. Nulla feugiat erat sit amet eros mattis, eu ullamcorper dolor ullamcorper. Quisque fermentum nulla eu felis lacinia, ut dapibus leo interdum. Aenean tempus est ut quam mollis, in tempus nisi ornare. Curabitur feugiat, dolor suscipit pulvinar fringilla, ma</p>
              </div>
              <div className="col-md-5">
                <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

              </div>
            </div>

            <hr className="featurette-divider" />

            <div className="row featurette" style={{ padding: "50"}}>
              <div className="col-md-7 order-md-2">
                <h2 className="featurette-heading fw-normal lh-1">Oh yeah, it’s that good. <span className="text-muted">See for yourself.</span></h2>
                <p className="lead">Another featurette? Of course. More placeholder content here to give you an idea of how this layout would work with some actual real-world content in place.</p>
              </div>
              <div className="col-md-5 order-md-1">
                <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

              </div>
            </div>

            <hr className="featurette-divider" />

            <div className="row featurette" style={{ padding: "50"}}>
              <div className="col-md-7">
                <h2 className="featurette-heading fw-normal lh-1">And lastly, this one. <span className="text-muted">Checkmate.</span></h2>
                <p className="lead">And yes, this is the last block of representative placeholder content. Again, not really intended to be actually read, simply here to give you a better view of what this would look like with some actual content. Your content.</p>
              </div>
              <div className="col-md-5">
                <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: 500x500" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee" /><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>

              </div>
            </div>

            <hr className="featurette-divider" />

            {/* <!-- /END THE FEATURETTES --> */}
            <div className="row" style={{ padding: "0 50 50 50"}}>
              <h2 className="fw-normal" style={{textAlign: "center", padding: "30px"}} >Meet the Team</h2>
              <div className="col-lg-3" style={{textAlign: "center"}}>
                <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice" focusable="false"><title></title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em"></text></svg>

                <h3 className="fw-normal" style={{ paddingTop: "10px"}}>Angel Giron</h3>
                <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
                <p><a className="btn btn-secondary" href="#">LinkedIn</a></p>
                <p><a className="btn btn-secondary" href="#">GitHub</a></p>
              </div>
              
              <div className="col-lg-3" style={{textAlign: "center"}}>
                <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice" focusable="false"><title></title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em"></text></svg>

                <h3 className="fw-normal" style={{ paddingTop: "10px"}}>JP Adigwu</h3>
                <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
                <p><a className="btn btn-secondary" href="#">LinkedIn</a></p>
                <p><a className="btn btn-secondary" href="#">GitHub</a></p>
              </div>
             
              <div className="col-lg-3" style={{textAlign: "center"}}>
                <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice" focusable="false"><title></title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em"></text></svg>

                <h3 className="fw-normal" style={{ paddingTop: "10px"}}>Kevin Park-Lee</h3>
                <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
                <p><a className="btn btn-secondary" href="#">LinkedIn</a></p>
                <p><a className="btn btn-secondary" href="#">GitHub</a></p>
              </div>
            
              <div className="col-lg-3" style={{textAlign: "center"}}>
                <svg className="bd-placeholder-img rounded-circle" width="140" height="140" xmlns="http://www.w3.org/2000/svg" role="img" preserveAspectRatio="xMidYMid slice" focusable="false"><title></title><rect width="100%" height="100%" fill="#777" /><text x="50%" y="50%" fill="#777" dy=".3em"></text></svg>

                <h3 className="fw-normal" style={{ paddingTop: "10px"}}>Tarik Mokhtech</h3>
                <p>Some representative placeholder content for the three columns of text below the carousel. This is the first column.</p>
                <p><a className="btn btn-secondary" href="#">LinkedIn</a></p>
                <BrandGithub/>
                <BrandLinkedin/>

                <p><a className="btn btn-secondary" href="#">GitHub</a></p>
              </div>
            </div>

          </div>
          {/* <!-- /.container --> */}

          <hr className="featurette-divider" />

          {/* <!-- FOOTER --> */}
          <footer className="container">
            <p className="float-end"><a href="#">Back to top</a></p>
            <p>&copy; dbSpy {date} </p>
          </footer>
        </main>


        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossOrigin="anonymous"></script>

      </body>
    </>
    //   {/* <div className="mainContainer" style={{display: "flex", flexDirection: "column", fontFamily:"Geneva", width: "50vw", margin:"auto"}}>
    //   <div style={styles} className="container">
    //   dbSpy Demo
    //   <br /> 
    //  {lorem}
    //  </div>
    //   <div style={styles} className="container">
    //    Why us? 
    //   <br /> 
    //    {lorem}
    //   </div>
    //   <div style={styles} className="container">
    //   What our users say
    //   <br />
    //   {lorem}
    //   </div>
    //   div style={styles} className="container">
    //   Latest Updates
    //   <br />
    //   {lorem}
    //   </div>
    //   <div style={styles} className="container">
    //   Meet the team
    //   <br /> 
    //   </div>
    //   </div>  */}
  )
}