export const generateRandomString = (length) => {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export const getRandomNumberBetweenTwoNumbers = (minRange, maxRange) => {
    return Math.floor(Math.random() * (maxRange - minRange + 1) + minRange)
}
