import React from 'react';

export default function extractLinks(input){

    const regexWithSpace =  /\[[^\]]*\] \([^)]*\)/g
    const regex =  /\[([^\]]*)\]\(([^)]*)\)/g
    if(input.match(regexWithSpace) != null ){
        return null;
    }
    let parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(input)) !== null) {
        console.log(match);
        match[1] = match[1].trim();
        if(match[2].substring(0, 8) !== "https://" && match[2].substring(0,7) !== "http://"){
            return null;
        }
        if(match[1].length === 0){
            return null;
        }
        if (lastIndex !== match.index) {
            parts.push(input.substring(lastIndex, match.index));
        }

        parts.push(
            <a key={match[2]} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">{match[1]}</a>
        );
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < input.length) {
        parts.push(input.substring(lastIndex));
    }
    return parts;
}

