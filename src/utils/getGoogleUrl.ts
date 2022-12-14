const getGoogleAuthUrl = () => {
  const base = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options = {
    redirect_uri: 'http://dbspy-env-1.eba-jf24jfwb.us-west-2.elasticbeanstalk.com/',
    client_id: '373965291205-utb8ih1hoeuf1g90okil5ju43tfdl3vs.apps.googleusercontent.com',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const queryStr = new URLSearchParams(options);
  return `${base}?${queryStr.toString()}`;
};

export const handleOAuthLogin = () => {
  const url = getGoogleAuthUrl();
  const strWindowFeatures =
    'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
  window.open(url, '_self', strWindowFeatures);
};
