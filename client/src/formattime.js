export default function formatTimeSince(askDate) {
    // Calculate the time difference and format it
    let timeDiff = Date.now() - askDate;
    timeDiff /= 1000;
    let seconds = Math.floor(timeDiff);
    if (seconds < 60) {
        return seconds + " seconds ago";
    }
    timeDiff /= 60;
    let minutes = Math.floor(timeDiff);
    if (minutes < 60) {
        return minutes + " minutes ago";
    }
    timeDiff /= 60;
    let hours = Math.floor(timeDiff);
    if (hours < 24) {
        return hours + " hours ago";
    }
    timeDiff /= 24;
    let days = Math.round(timeDiff);
    if (days < 365) {
        // On the other hand, if we were viewing the page 24 hrs after the question was posted then the metadata should be displayed as <username> asked <Month><day> at <hh:min>.
        let date = new Date(askDate);
        let month = date.toLocaleString('default', { month: 'long' });
        let day = date.getDate();
        let hour = date.getHours();
        let minute = date.getMinutes();
        if (minute < 10) {
            minute = "0" + minute;
        }
        return `${month} ${day} at ${hour}:${minute}`;   
    }
    // Further, if the question is viewed a year after the posted date then the metadata should be displayed as <username> asked <Month><day>,<year> at <hh:min>.
    let date = new Date(askDate);
    let month = date.toLocaleString('default', { month: 'long' });
    let day = date.getDate();
    let year = date.getFullYear();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = "0" + minute;
    }
    return `${month} ${day}, ${year} at ${hour}:${minute}`;
}
