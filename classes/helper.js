exports.getRootUrl = () => {
    return process.env.ROOT_URL;
}

// convert start time from string to date object
exports.convertStartTime = (date, start_time) => {
    var temp = start_time.split(':');
    var d = new Date(date);
    d.setUTCHours(parseInt(temp[0]));
    d.setMinutes(parseInt(temp[1]));
    return d;
}

exports.convertEndTime = (start_time, duration) => {
    var temp = new Date(start_time).getTime() + duration*60*1000;
    return new Date(temp);
}