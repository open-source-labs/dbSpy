import dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'
import log from '../logger/index'
dotenv.config()

interface GoogleTokenData {
    access_token: string,
    expires_in: Number,
    refresh_token: string,
    scope: string,
}

export const getGoogleAuthToken: any = async ({ code }: { code: string }) => {
    const url = 'https://oauth2.googleapis.com/token'

    const options = {
        code,
        client_id: '971147535395-bd0vjrequipsrg5c74htoafjbmubgn3m.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000/api/oauth/google',
        grant_type: 'authorization_code'
    }

    try {
        const response = await axios.post(url, qs.stringify(options), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        log.info('getGoogleAuthToken: Retrieved id_token')
        return response.data;

    } catch (error: any) {
        log.info(`Error: ${error}. Failed to get googleAuthToken`)
        throw new Error(error.message)
    }
}