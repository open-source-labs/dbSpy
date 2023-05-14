"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Profile_1 = __importDefault(require("./Profile"));
//profile imports
const ag_jpg_1 = __importDefault(require("../../assets/contributors/ag.jpg"));
const ja_jpg_1 = __importDefault(require("../../assets/contributors/ja.jpg"));
const kp_jpg_1 = __importDefault(require("../../assets/contributors/kp.jpg"));
const tm_jpg_1 = __importDefault(require("../../assets/contributors/tm.jpg"));
const bg_jpg_1 = __importDefault(require("../../assets/contributors/bg.jpg"));
const em_jpg_1 = __importDefault(require("../../assets/contributors/em.jpg"));
const ml_jpg_1 = __importDefault(require("../../assets/contributors/ml.jpg"));
const sl_jpeg_1 = __importDefault(require("../../assets/contributors/sl.jpeg"));
const km_jpg_1 = __importDefault(require("../../assets/contributors/km.jpg"));
const ar_jpg_1 = __importDefault(require("../../assets/contributors/ar.jpg"));
const aa_jpg_1 = __importDefault(require("../../assets/contributors/aa.jpg"));
const sg_jpg_1 = __importDefault(require("../../assets/contributors/sg.jpg"));
const kw_jpg_1 = __importDefault(require("../../assets/contributors/kw.jpg"));
const alex_tu_jpg_1 = __importDefault(require("../../assets/contributors/alex_tu.jpg"));
const michael_costello_jpeg_1 = __importDefault(require("../../assets/contributors/michael_costello.jpeg"));
const steven_geiger_jpg_1 = __importDefault(require("../../assets/contributors/steven_geiger.jpg"));
const yufa_li_jpeg_1 = __importDefault(require("../../assets/contributors/yufa_li.jpeg"));
const dk_png_1 = __importDefault(require("../../assets/contributors/dk.png"));
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
const profileList = [
    {
        imgUrl: ag_jpg_1.default,
        name: 'Angel Giron',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/acgiron/',
        githubUrl: 'https://github.com/g94angel',
    },
    {
        imgUrl: ja_jpg_1.default,
        name: 'John Paul Adigwu',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/johnpaul-adigwu/',
        githubUrl: 'https://github.com/engineerous',
    },
    {
        imgUrl: kp_jpg_1.default,
        name: 'Kevin Park-Lee',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/kevin38424/',
        githubUrl: 'https://github.com/kevin38424',
    },
    {
        imgUrl: tm_jpg_1.default,
        name: 'Tarik Mokhtech',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/tarik-mokhtech/',
        githubUrl: 'https://github.com/MockTech',
    },
    {
        imgUrl: bg_jpg_1.default,
        name: 'Brett Guidry',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/brett-guidry-6b6085107/',
        githubUrl: 'https://github.com/Lurkbot9000',
    },
    {
        imgUrl: em_jpg_1.default,
        name: 'Emil Mebasser',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/emil-mebasser-a1a2a815/',
        githubUrl: 'https://github.com/ejmebasser',
    },
    {
        imgUrl: ml_jpg_1.default,
        name: 'Mimi Le',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/my-le-a94575226/',
        githubUrl: 'https://github.com/kawaiiyummy14',
    },
    {
        imgUrl: sl_jpeg_1.default,
        name: 'Samson Lam',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/samson-lam-455846219/',
        githubUrl: 'https://github.com/sflam2013',
    },
    {
        imgUrl: km_jpg_1.default,
        name: 'Kris Magat',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/kmag/',
        githubUrl: 'https://github.com/KrisMagat',
    },
    {
        imgUrl: ar_jpg_1.default,
        name: 'Adrian Reczek',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/adrian-reczek-7b2816230/',
        githubUrl: 'https://github.com/adziu1234',
    },
    {
        imgUrl: aa_jpg_1.default,
        name: 'Anthony Al-Rifai',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/anthony-al-rifai-31677a100/',
        githubUrl: 'https://github.com/AnthonyAl-Rifai',
    },
    {
        imgUrl: sg_jpg_1.default,
        name: 'Santiago Gil Maya',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/santiago-gil-929721121//',
        githubUrl: 'https://github.com/santiago-gil',
    },
    {
        imgUrl: kw_jpg_1.default,
        name: 'Kevin Wang',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/kevin-w-b841b13/',
        githubUrl: 'https://github.com/kwang929',
    },
    {
        imgUrl: alex_tu_jpg_1.default,
        name: 'Alexander Tu',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/atu816/',
        githubUrl: 'https://github.com/atu816',
    },
    {
        imgUrl: michael_costello_jpeg_1.default,
        name: 'Michael Costello',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/mcostello-swe/',
        githubUrl: 'https://github.com/neighbor-peace',
    },
    {
        imgUrl: steven_geiger_jpg_1.default,
        name: 'Steven Geiger',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/sgeiger9/',
        githubUrl: 'https://github.com/geistnine',
    },
    {
        imgUrl: yufa_li_jpeg_1.default,
        name: 'Yufa Li',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/yufa-li/',
        githubUrl: 'https://github.com/01001101CK',
    },
    {
        imgUrl: dk_png_1.default,
        name: 'Das Kang',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/das-kang/',
        githubUrl: 'https://github.com/dahae0309',
    },
    {
        imgUrl: ag_jpg_1.default,
        name: 'Joseph Tejeda',
        title: 'Software Engineer',
        linkedInUrl: 'https://www.linkedin.com/in/atxjtejeda/',
        githubUrl: 'https://github.com/JosephTejeda',
    },
    {
        imgUrl: ag_jpg_1.default,
        name: 'Stephen Havig',
        title: 'Software Engineer',
        linkedInUrl: '',
        githubUrl: '',
    },
    {
        imgUrl: ag_jpg_1.default,
        name: 'Yichung Chiu',
        title: 'Software Engineer',
        linkedInUrl: '',
        githubUrl: '',
    },
];
function Contributors() {
    const profiles = [];
    profileList.reverse(); // Recent contributors first
    let i = 0;
    for (const prof of profileList) {
        profiles.push(react_1.default.createElement(Profile_1.default, { props: prof, key: `contributor${i}` }));
        i += 1;
    }
    return (react_1.default.createElement("div", { className: "contributors container my-24 mx-auto px-6" },
        react_1.default.createElement("section", { className: "mb-32 text-center text-gray-800" },
            react_1.default.createElement("h2", { className: "team-header mb-32 text-3xl font-bold text-gray-900 dark:text-[#f8f4eb]" }, "Meet the dbSpy Team"),
            react_1.default.createElement("div", { className: "flex flex-row flex-wrap justify-around" }, profiles))));
}
exports.default = Contributors;
//# sourceMappingURL=Contributors.js.map