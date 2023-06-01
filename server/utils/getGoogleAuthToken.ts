import dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'
import log from '../logger/index'
dotenv.config()

export const getGoogleAuthToken: any = async ({ code }: { code: string }) => {
    const url: string = 'https://oauth2.googleapis.com/token';

    const options = {
        code,
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
        client_secret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_AUTH_CALLBACK,
        grant_type: 'authorization_code'
    };

    try {
        const response = await axios.post(url, qs.stringify(options), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        log.info('getGoogleAuthToken: Retrieved id_token')
        return response.data;

    } catch (error: unknown) {
        log.info(`Error: ${error}. Failed to get googleAuthToken`)
        throw new Error((error as Error).message)
    }
}