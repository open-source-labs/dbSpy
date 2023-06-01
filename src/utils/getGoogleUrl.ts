import axios from 'axios';

export const handleOAuthLogin = async () => {
  const res = await axios.get('/api/googleAuthUrl');
  const url = JSON.parse(res.data);
  const strWindowFeatures =
    'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
  window.open(url, '_self', strWindowFeatures);
};
