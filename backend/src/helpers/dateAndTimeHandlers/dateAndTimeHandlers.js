export const getTodayTimestamp = () => {
    let d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
}

export const getTimestampOfCurrentMonthStart = () => {
    let d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d.getTime()
}