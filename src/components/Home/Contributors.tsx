import React from 'react';
import Profile from './Profile';

//for future contributors: add your profile information to the profileList array as an object formatted as shown below, and it will auto-populate the home page with a new profile card

type profileInfo = {
  imgUrl: string,
  name: string,
  title: string,
  linkedInUrl: string,
  githubUrl: string
}

const profileList: profileInfo[] = [
  {imgUrl: 'https://avatars.githubusercontent.com/u/85323481?v=4', name: 'Angel Giron', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/acgiron/', githubUrl: 'https://github.com/g94angel'},
  {imgUrl: 'https://media-exp1.licdn.com/dms/image/C5603AQH-DE3IvkV3tQ/profile-displayphoto-shrink_800_800/0/1659225312575?e=1666828800&v=beta&t=eu2vPhIW8hB7Ho9BERJfVevfPpYsPAzFj0UOO6iOvIg', name: 'John Paul Adigwu', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/johnpaul-adigwu/', githubUrl: 'https://github.com/engineerous'},
  {imgUrl: 'https://avatars.githubusercontent.com/u/11093217?v=4', name: 'Kevin Park-Lee', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/kevin38424/', githubUrl: 'https://github.com/kevin38424'},
  {imgUrl: 'https://avatars.githubusercontent.com/u/83368864?v=4', name: 'Tarik Mokhtech', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/tarik-mokhtech/', githubUrl: 'https://github.com/MockTech'},
  {imgUrl: 'https://cdn.discordapp.com/attachments/1006201036714819756/1011742768286142594/hands.jpg', name: 'Brett Guidryu', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/brett-guidry-6b6085107/', githubUrl: 'https://github.com/Lurkbot9000'},
  {imgUrl: 'https://cdn.discordapp.com/attachments/1006201036714819756/1011743468017680404/IMG_0151.JPG', name: 'Emil Mebasser', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/emil-mebasser-a1a2a815/', githubUrl: 'https://github.com/ejmebasser'},
  {imgUrl: 'https://cdn.discordapp.com/attachments/992305633787392096/1011759408931405976/IMG_3804.jpg', name: 'Mimi Le', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/my-le-a94575226/', githubUrl: 'https://github.com/kawaiiyummy14'},
  {imgUrl: 'https://cdn.discordapp.com/attachments/1006201036714819756/1011742184329969664/WhatsApp_Image_2022-05-21_at_1.33.01_PM.jpeg', name: 'Samson Lam', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/samson-lam-455846219/', githubUrl: 'https://github.com/sflam2013'},
  {imgUrl: 'https://media-exp1.licdn.com/dms/image/D5603AQFjZTMyJ9XnPw/profile-displayphoto-shrink_800_800/0/1665785094525?e=1671062400&v=beta&t=_IiFeujOCqnNcaO2_UUqwqXhOzTEWWeuJxpZf1ZzpUA', name: 'Adrian Reczek', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/adrian-reczek-7b2816230/', githubUrl: 'https://github.com/adziu1234'},
  {imgUrl: 'https://media-exp1.licdn.com/dms/image/D5603AQE2NTlzHwU-eQ/profile-displayphoto-shrink_800_800/0/1665626980212?e=1671062400&v=beta&t=eeBl64yAc9ongylu4EYV8QONG0GfoeC64QxB5CvqsLY', name: 'Santiago Gil Maya', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/santiago-gil-929721121//', githubUrl: 'https://github.com/santiago-gil'},
  {imgUrl: 'https://media-exp1.licdn.com/dms/image/C5603AQGN1-X29RrqZA/profile-displayphoto-shrink_800_800/0/1578335748935?e=1671062400&v=beta&t=zY0qfhdH5SWqg9hxf2LWFkA42E1O6w5vFZ7jDNuInY8', name: 'Anthony Al-Rifai', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/anthony-al-rifai-31677a100/', githubUrl: 'https://github.com/AnthonyAl-Rifai'},
  {imgUrl: 'https://media-exp1.licdn.com/dms/image/C5603AQEehNwSOe4sBQ/profile-displayphoto-shrink_800_800/0/1622689374305?e=1671062400&v=beta&t=-MTa5UbR8o0pqy1slfDlSxyZlBibvvfsicEzIb8b5ok', name: 'Kevin Wang', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/kevin-w-b841b13/', githubUrl: 'https://github.com/kwang929'},
  {imgUrl: 'https://media-exp1.licdn.com/dms/image/C5603AQHpX6W8WNoF8A/profile-displayphoto-shrink_800_800/0/1652130254932?e=1671062400&v=beta&t=QAsTvklDTbXS8kxmloJNCxFhkI631V2ZoUPchW8oVkg', name: 'Kris Magat', title: 'Software Engineer', linkedInUrl: 'https://www.linkedin.com/in/kmag/', githubUrl: 'https://github.com/KrisMagat'},
];


export default function Contributors(){

  const profiles = [];
  for (const prof of profileList){
    profiles.push(Profile(prof))
  }

  return (
    <div className="container my-24 px-6 mx-auto">

<section className="mb-32 text-gray-800 text-center">
  <h2 className="text-3xl font-bold mb-32">Meet the dbSpy Team</h2>

  <div className="flex flex-row flex-wrap justify-around">
    {profiles}
  </div>
</section>

</div>
  )
}
