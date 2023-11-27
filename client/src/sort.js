function sortByTime(){
    let sorttime = (a, b) => {
        let currentTime = new Date();
        let aDif = currentTime - new Date(a.ask_date_time);
        let bDif = currentTime - new Date(b.ask_date_time);
        return aDif - bDif;
    }
    return sorttime
}

function sortByAnswered(data){ // this method sorts the questions by the most recent answered time
    let timeMap = new Map(); // map of question -> most recent answered date
    for(const i in data){ // go through all the questions and pick the most recent answer for each question and add to the time map
        let date = [];
        for(const j in data[i]['answers']){
            date.push(new Date(data[i]['answers'][j].ans_date_time));
        }
        timeMap.set(data[i], Math.max.apply(null, date));
    }
    const sort = (a,b) => {
        let currentTime = new Date();
        let aDif = currentTime - timeMap.get(a);
        let bDif = currentTime - timeMap.get(b);
        return aDif - bDif;
    }
    return sort;
}

function sortByUnAnswered(){
    let filterUnAnswer = (a) => Object.keys(a.answers).length === 0;
    return filterUnAnswer;
}


export {sortByTime, sortByAnswered, sortByUnAnswered}