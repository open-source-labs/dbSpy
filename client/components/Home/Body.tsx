import React from 'react';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { BrandGithub, BrandLinkedin } from 'tabler-icons-react';

import logo from "../../assets/logo5-blue-cropped_all_sides.png";
import gif from "../../assets/SQL.gif";


export default function Body() {
  const date = new Date().getFullYear();

  //lazy loading
  const images = [...document.querySelectorAll('.Body-img-col')];
  
  const options = {
    root: null, //it is the viewport
    threshold: 0,
    rootMargin: "50px",
 };

  // lazyLoad()

  // const options = {
  //   root: document.querySelector('body-Text-Muted-1'),
  //   rootMargin: '100px',
  //   threshold: 1.0
  // };

  const observer = new IntersectionObserver(onIntersection, options);

  function onIntersection(imageEntites: any){
    imageEntites.forEach((image: any) => {
      if (!image.isIntersecting) {
        return;
      } else {
          const text = image.target.attributes['dataset-src']
          image.target.src = image.target.attributes['dataset-src'].value;
          observer.unobserve(image.target);
         }
      } 
    )}
 
  images.forEach(image => observer.observe(image));

  
  return (
    <>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-gH2yIJqKdNHPEq0n4Mqa/HGKIhSkIHeL5AyhkYV8i59U5AR6csBvApHHNl/vI1Bx"
          crossOrigin="anonymous"
        />
        
      </head>
      <body className='body-Body' 
      >
        <main>
         
          <div className="container marketing">
            {/* <!-- START THE FEATURETTES --> */}
{/* dbSpy intro */}
            <div className="body-Main-Div">
              <div className="body-Main-Div-Div">
                <h2 className="body-Main-H2">
                  Database development simplified{' '}
                  
                </h2>
                <h4 className="body-Text-Muted-1">
                  dbSpy is an open-source tool to facilitate relational database development. It's the only tool you need to visualize, modify, and build your database. 
                </h4>
              </div>
              <div className="body-Main-Div-Logo">
                <img className='body-Main-Div-Div-Img'
                  src={logo} alt="dbSpy logo"
                />
               
              </div>
            </div>

            <hr className="featurette-divider" />

            {/* dbSpy gif */}
            <div className="body-Main-Div">
              <div className="body-Main-Div-col-md-7">
                <img className='body-Main-Div-Div-Div-Img'
                  src={"https://user-images.githubusercontent.com/83368864/179806428-f73b2b18-b82b-4b19-8ea1-5af72ddd23d3.gif"} alt="dbSpy gif"
                />
              </div>
                

            <div className="body-Main-Div-col-md-5">
              <h2 className="featurette-heading-fw-normal-lh-1">
                  Key features{' '}
                </h2>
                <h4 className="body-Text-Muted-2">
                    Database connection
                    <br/>
                    Schema modification
                    <br/>
                    SQL query generator
                    <br/>
                    ER diagrams
                    <br/>
                    and much more!
                </h4>
            </div>
            </div>
            <hr className="featurette-divider" />
            <div className="Body-row" 
            >
              <h2
                className="Body-fw-normal-h2"
              >
                Meet the Team
              </h2>
              <div className='body-Team-Container'>
            
                <div className="Body-col-lg-3">
                  <img className="Body-img-col" 
                   dataset-src="https://avatars.githubusercontent.com/u/85323481?v=4" loading="lazy" alt="AngelGiron" />

                  <h3 className="Body-fw-normal">
                   Angel Giron
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/acgiron/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/g94angel">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>
                <div className="Body-col-lg-3">
                  <img className="Body-img-col"
                   dataset-src="https://media-exp1.licdn.com/dms/image/C5603AQH-DE3IvkV3tQ/profile-displayphoto-shrink_800_800/0/1659225312575?e=1666828800&v=beta&t=eu2vPhIW8hB7Ho9BERJfVevfPpYsPAzFj0UOO6iOvIg" loading="lazy"alt="JohnPaulAdigwu" />

                  <h3 className="Body-fw-normal">
                    John Paul Adigwu
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/johnpaul-adigwu/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/engineerous">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>
                <div className="Body-col-lg-3">
                  <img className="Body-img-col" 
                   dataset-src="https://avatars.githubusercontent.com/u/11093217?v=4" loading="lazy" alt="KevinParkLee" />

                  <h3 className="Body-fw-normal">
                    Kevin Park-Lee
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/kevin38424/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/kevin38424">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>

                <div className="Body-col-lg-3">
                  <img className="Body-img-col" 
                   dataset-src="https://avatars.githubusercontent.com/u/83368864?v=4" loading="lazy"alt="TarikMokhtech" />

                  <h3 className="Body-fw-normal">
                    Tarik Mokhtech
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/tarik-mokhtech/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/MockTech" >
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>
                {/* the end  */}
              </div>  
              <div className='body-Team-Container 1'>

              <div className="Body-col-lg-3">
                  <img className="Body-img-col"
                  dataset-src="https://cdn.discordapp.com/attachments/1006201036714819756/1011742768286142594/hands.jpg" 
                  loading="lazy" 
                  alt="BrettGuidry" />

                  <h3 className="Body-fw-normal">
                    Brett Guidry
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/brett-guidry-6b6085107/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/Lurkbot9000">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>
                <div className="Body-col-lg-3">
                  <span>
                  <img className="Body-img-col" 
                  dataset-src="https://cdn.discordapp.com/attachments/1006201036714819756/1011743468017680404/IMG_0151.JPG" loading="lazy" alt="EmilMebasser" />

                  </span>

                  <h3 className="Body-fw-normal">
                    Emil Mebasser
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/emil-mebasser-a1a2a815/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/ejmebasser">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>

                <div className="Body-col-lg-3">
                  <img className="Body-img-col" 
                  dataset-src="https://cdn.discordapp.com/attachments/992305633787392096/1011759408931405976/IMG_3804.jpg" loading="lazy" alt="MimiLe" />

                  <h3 className="Body-fw-normal">
                   Mimi Le
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/my-le-a94575226/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/kawaiiyummy14">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>

                <div className="Body-col-lg-3">
                  <img className="Body-img-col" 
                  dataset-src="https://cdn.discordapp.com/attachments/1006201036714819756/1011742184329969664/WhatsApp_Image_2022-05-21_at_1.33.01_PM.jpeg" loading="lazy"alt="Samson Lam" />

                  <h3 className="Body-fw-normal">
                    Samson Lam
                  </h3>
                  <p className="Body-p-software">
                    Software Engineer
                  </p>
                  <div className="Body-footer">
                    <a className="Body-btn-btn-dark-btn-sm" href="https://www.linkedin.com/in/samson-lam-455846219/">
                      <BrandLinkedin className="body-brand"/>
                      <i className="sprite-linkedin"></i>
                    </a>
                    <a className="Body-btn-btn-dark-btn-sm" href="https://github.com/sflam2013">
                      <BrandGithub className="body-brand"/>
                      <i className="sprite sprite-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
