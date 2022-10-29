export const getGoogleAuthUrl = () => {
    const base = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = {
        redirect_uri: 'http://localhost:3000/api/oauth/google',
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID as string,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' ')
    }
    const queryStr = new URLSearchParams(options)
    return `${base}?${queryStr.toString()}`
}