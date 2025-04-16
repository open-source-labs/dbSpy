import React from 'react';
import Profile from './Profile';
//profile imports
import AG from '../../assets/contributors/ag.jpg';
import JA from '../../assets/contributors/ja.jpg';
import KP from '../../assets/contributors/kp.jpg';
import TM from '../../assets/contributors/tm.jpg';
import BG from '../../assets/contributors/bg.jpg';
import EM from '../../assets/contributors/em.jpg';
import ML from '../../assets/contributors/ml.jpg';
import SL from '../../assets/contributors/sl.jpeg';
import KM from '../../assets/contributors/km.jpg';
import AR from '../../assets/contributors/ar.jpg';
import AA from '../../assets/contributors/aa.jpg';
import SG from '../../assets/contributors/sg.jpg';
import KW from '../../assets/contributors/kw.jpg';
import YC from '../../assets/contributors/yc.jpg';
import alexTu from '../../assets/contributors/alex_tu.jpg';
import michaelCostello from '../../assets/contributors/michael_costello.jpeg';
import stevenGeiger from '../../assets/contributors/steven_geiger.jpg';
import yufaLi from '../../assets/contributors/yufa_li.jpeg';
import DK from '../../assets/contributors/dk.png';
import SH from '../../assets/contributors/SH.jpg';
import JT from '../../assets/contributors/joseph_360.png';
import DJ from '../../assets/contributors/dj.png';
import JR from '../../assets/contributors/JR.png';
import PS from '../../assets/contributors/PS.png';
import mc from '../../assets/contributors/mc.jpg';
import DO from '../../assets/contributors/DO.jpeg';
import MattC from '../../assets/contributors/MattC.jpg';
import MattJ from '../../assets/contributors/Matthew_Jones.jpeg';
import StanH from '../../assets/contributors/Stan.jpg';
import DonM from '../../assets/contributors/DonM.jpg';
import Reva from '../../assets/contributors/Reva.png';
import Vicky from '../../assets/contributors/Vicky.jpg';
import Roshumba from '../../assets/contributors/Roshumba.png';
import Emma from '../../assets/contributors/Emma.jpeg';
import Yihe from '../../assets/contributors/Yihe.jpg';
//for future contributors: add your profile information to the profileList array as an object formatted as shown below, and it will auto-populate the home page with a new profile card

type profileInfo = {
  imgUrl: string;
  name: string;
  title: string;
  linkedInUrl: string;
  githubUrl: string;
};
/*
Example:
{
  imgUrl: '[INSERT CONTRIBUTOR'S PROFILE PHOTO HERE]',
  name: 'Jane Doe',
  title: 'Software Engineer',
  linkedInUrl: '[INSERT LINKEDIN LINK HERE]',
  githubUrl: 'https://github.com/[INSERT GITHUB HANDLE HERE]'
}
*/

const profileList: profileInfo[] = [
  {
    imgUrl: AG,
    name: 'Angel Giron',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/acgiron/',
    githubUrl: 'https://github.com/g94angel',
  },
  {
    imgUrl: JA,
    name: 'John Paul Adigwu',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/johnpaul-adigwu/',
    githubUrl: 'https://github.com/engineerous',
  },
  {
    imgUrl: KP,
    name: 'Kevin Park-Lee',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/kevin38424/',
    githubUrl: 'https://github.com/kevin38424',
  },
  {
    imgUrl: TM,
    name: 'Tarik Mokhtech',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/tarik-mokhtech/',
    githubUrl: 'https://github.com/MockTech',
  },
  {
    imgUrl: BG,
    name: 'Brett Guidry',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/brett-guidry-6b6085107/',
    githubUrl: 'https://github.com/Lurkbot9000',
  },
  {
    imgUrl: EM,
    name: 'Emil Mebasser',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/emil-mebasser-a1a2a815/',
    githubUrl: 'https://github.com/ejmebasser',
  },
  {
    imgUrl: ML,
    name: 'Mimi Le',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/my-le-a94575226/',
    githubUrl: 'https://github.com/kawaiiyummy14',
  },
  {
    imgUrl: SL,
    name: 'Samson Lam',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/samson-lam-455846219/',
    githubUrl: 'https://github.com/sflam2013',
  },
  {
    imgUrl: KM,
    name: 'Kris Magat',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/kmag/',
    githubUrl: 'https://github.com/KrisMagat',
  },
  {
    imgUrl: AR,
    name: 'Adrian Reczek',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/adrian-reczek-7b2816230/',
    githubUrl: 'https://github.com/adziu1234',
  },
  {
    imgUrl: AA,
    name: 'Anthony Al-Rifai',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/anthony-al-rifai-31677a100/',
    githubUrl: 'https://github.com/AnthonyAl-Rifai',
  },
  {
    imgUrl: SG,
    name: 'Santiago Gil Maya',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/santiago-gil-929721121//',
    githubUrl: 'https://github.com/santiago-gil',
  },
  {
    imgUrl: KW,
    name: 'Kevin Wang',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/kevin-w-b841b13/',
    githubUrl: 'https://github.com/kwang929',
  },
  {
    imgUrl: alexTu,
    name: 'Alexander Tu',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/atu816/',
    githubUrl: 'https://github.com/atu816',
  },
  {
    imgUrl: michaelCostello,
    name: 'Michael Costello',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/mcostello-swe/',
    githubUrl: 'https://github.com/neighbor-peace',
  },
  {
    imgUrl: stevenGeiger,
    name: 'Steven Geiger',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/sgeiger9/',
    githubUrl: 'https://github.com/geistnine',
  },
  {
    imgUrl: yufaLi,
    name: 'Yufa Li',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/yufa-li/',
    githubUrl: 'https://github.com/01001101CK',
  },
  {
    imgUrl: DK,
    name: 'Das Kang',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/das-kang/',
    githubUrl: 'https://github.com/dahae0309',
  },
  {
    imgUrl: JT,
    name: 'Joseph Tejeda',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/atxjtejeda/',
    githubUrl: 'https://github.com/JosephTejeda',
  },
  {
    imgUrl: SH,
    name: 'Stephen Havig',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/stephen-havig-199340145/',
    githubUrl: 'https://github.com/Stephen-Havig',
  },
  {
    imgUrl: YC,
    name: 'Yichung Chiu',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/yichung-chiu-b14a94272/',
    githubUrl: 'https://github.com/ychiu5896',
  },
  {
    imgUrl: DJ,
    name: 'David Jones',
    title: 'Software Engineer',
    linkedInUrl: 'http://www.linkedin.com/in/davidjonesswe',
    githubUrl: 'https://github.com/david-jones-git',
  },
  {
    imgUrl: DO,
    name: 'Darius Okafor',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/dariusokafor/',
    githubUrl: 'https://github.com/DE7741',
  },
  {
    imgUrl: JR,
    name: 'John Ruiz',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/john-ruiz-profile/',
    githubUrl: 'https://github.com/johnruiz17',
  },
  {
    imgUrl: mc,
    name: 'Minh Chang',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/minh-chang/',
    githubUrl: 'https://github.com/miha-cha',
  },
  {
    imgUrl: PS,
    name: 'Parwinder Singh',
    title: 'Software Engineer',
    linkedInUrl: 'http://www.linkedin.com/in/singh-parwinder',
    githubUrl: 'https://github.com/PintaAE86',
  },
  {
    imgUrl: MattC,
    name: 'Matthew Cummings',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/matthew-cummings-a25179113/',
    githubUrl: 'https://github.com/mcummings190',
  },
  {
    imgUrl: MattJ,
    name: 'Matthew Jones',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/matthew-jones-05a27840/',
    githubUrl: 'https://github.com/TagiMagi',
  },
  {
    imgUrl: StanH,
    name: 'Stanley Ho',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/stanho347/',
    githubUrl: 'https://github.com/Stanley7c114',
  },
  {
    imgUrl: DonM,
    name: 'Donald Macak',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/donald-macak-7b6592279/',
    githubUrl: 'https://github.com/Donald-Macak',
  },
  {
    imgUrl: Reva,
    name: 'Revathy Venkataraman',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/revavenk',
    githubUrl: 'https://github.com/reva2024',
  },
  {
    imgUrl: Vicky,
    name: 'Vicky Yue',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/vickyue/',
    githubUrl: 'https://github.com/vyue013',
  },
  {
    imgUrl: Roshumba,
    name: 'Roshumba Llewellyn',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/roshumballewellyn/',
    githubUrl: 'https://github.com/roshumba',
  },
  {
    imgUrl: Emma,
    name: 'Emma Vargas',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/emmavargas/',
    githubUrl: 'https://github.com/emma-vargas',
  },
  {
    imgUrl: Yihe,
    name: 'Yihe Liu',
    title: 'Software Engineer',
    linkedInUrl: 'https://www.linkedin.com/in/yiheliu',
    githubUrl: 'https://github.com/SparrowGecko',
  },
];

export default function Contributors() {
  const profiles = [] as React.ReactNode[];
  for (let i = profileList.length - 1; i >= 0; i--) {
    profiles.push(<Profile props={profileList[i]} key={`contributor${i}`} />);
  }

  return (
    <div className=" contributors container mx-auto my-24 px-6 dark:bg-primary">
      <section className="mb-32 text-center text-gray-800">
        <h2 className="team-header mb-32 text-3xl font-bold text-gray-900 dark:text-[#f8f4eb]">
          Meet the dbSpy Team
        </h2>
        <div className="flex flex-row flex-wrap justify-around dark:bg-primary">
          {profiles}
        </div>
      </section>
    </div>
  );
}
