import { createClient } from 'redis'

let redisClient = null;

export const getRedisClient = async () => {
    try {
        if (redisClient == null) {
            redisClient = createClient();
            await redisClient.connect();
        }
        return redisClient

    } catch (error) {
        return null
    }
}