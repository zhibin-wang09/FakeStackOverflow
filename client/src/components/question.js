import formatTimeSince from "../formattime";

export default function Question(props) {
    // Assuming props.tagIds now contains tag names directly
    const tags = props.tagIds.map(tag => 
        <span key={tag[0]} className="text-gray-500 text-sm bg-gray-200 px-2 rounded">
            {tag[1]}
        </span>
    );

    // Temporary placeholder summary
    const temporarySummary = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum accumsan ex, at sodales arcu bibendum a.";

    return (
        <div className="bg-white rounded-lg p-4 shadow-md mb-4 cursor-pointer" onClick={() => props.onQuestionClick(props.qid)}>
            <div className="flex justify-between items-center">
                <div className="text-gray-600">
                    views: {props.views}
                </div>
            </div>
            <p className="text-lg font-bold hover:text-blue-500">
                {props.title}
            </p>
            <div className="flex space-x-2 mt-2">
                {tags}
            </div>
            <div className="text-gray-600 text-sm flex items-center mt-2">
                <span className="text-gray-600">
                    Posted by: {props.askedBy.username}
                </span>
                <span>
                    • {formatTimeSince(props.askDate)}
                </span>
            </div>
            <div className="bg-gray-100 p-4 rounded-md mt-4">
                <p className="text-sm">{props.summary || temporarySummary}</p>
            </div>
        </div>
    );
}
