
function scanKeyWords(input){
    let info = input;
    if(info === '') return [];
    let listOfKeywords = []
    info = info.split(" ");
    // info contains different keywords, some may contain tags. Example, ["javascript", "[react][html]", "css"]
    for (let i = 0; i < info.length; i++) {
        if (info[i].includes("[")) {
            for (let j = 0; j < info[i].length; j++) {
                if (info[i][j] === '[') { // if search is a keyword
                    let start = j;
                    while (info[i][j] === '[') j++;
                    start = j - 1;
                    while (j < info[i].length) {
                        if (info[i][j] === ']') {
                            let end = j;
                            listOfKeywords.push([true, info[i].slice(start + 1, end).toLowerCase()]);
                            break;
                        }
                        j++;
                    }
                }
            }
        } else {
            // if search is not a keyword
            listOfKeywords.push([false, info[i].toLowerCase()]);
        }
    }
    return listOfKeywords;
}

export default function searchInput(input,data){
    let keyword = scanKeyWords(input);
    if(keyword.length === 0){
        return data.questions;
    }
    let filteredSet = new Set();
    let filtered = [];
    let tagmap = new Map();
    for (let i = 0; i < data.tags.length; i++) {
        tagmap.set(data.tags[i].tid, data.tags[i].name);
    }
    for (let j = 0; j < keyword.length; j++) {
        for (let i = 0; i < data.questions.length; i++) {
            if (keyword[j][0] === true) {
                // keyword is a tag
                for (let k = 0; k < data.questions[i].tagIds.length; k++) {
                    if (keyword[j][1] === tagmap.get(data.questions[i].tagIds[k])) {
                        filteredSet.add(data.questions[i]);
                    }
                }
            } else {
                // keyword is not a tag so search from question title and text.
                if (data.questions[i].title.toLowerCase().split(" ").includes(keyword[j][1]) || data.questions[i].text.toLowerCase().split(" ").includes(keyword[j][1])) {
                    filteredSet.add(data.questions[i]);
                }
            }
        }
    }
    filtered = Array.from(filteredSet);
    return filtered
}