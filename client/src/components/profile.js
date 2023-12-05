import React from "react";

export default function ProfilePage() {
  // placeholder data that I use for testing this crap cus idk what backend doin 
  const user = {
    username: "JohnDoe",
    memberSince: "January 2022",
    reputation: 150,
    questions: [
      { id: 1, title: "How to use React Hooks?" },
      { id: 2, title: "Best practices for REST API design" },
    ],
    tags: [
      { id: 1, name: "react", editable: true }, // editable means user can edit/delete this tag
      { id: 2, name: "javascript", editable: false }, // testing if we can hide the edit/delete buttons
    ],
    answeredQuestions: [
      {
        id: 3,
        title: "What is the difference between let and const in JavaScript?",
        answers: [
          { id: 1, text: "Let allows reassignment, const does not." },
        ],
      },
    ],
  };

  const editQuestion = (questionId) => {
    // do this later
    console.log(`Editing question with ID ${questionId}`);
  };

  
  const deleteQuestion = (questionId) => {
    // do this later
    console.log(`Deleting question with ID ${questionId}`);
  };


  const editTag = (tagId) => {
    // do later
    console.log(`Editing tag with ID ${tagId}`);
  };

  const deleteTag = (tagId) => {
    // do later
    console.log(`Deleting tag with ID ${tagId}`);
  };


  const editAnswer = (answerId) => {
    // do later
    console.log(`Editing answer with ID ${answerId}`);
  };


  const deleteAnswer = (answerId) => {
    // do later
    console.log(`Deleting answer with ID ${answerId}`);
  };

  return (
    <div className="mx-8 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile</h2>
        
      </div>

      <div className="bg-gray-100 p-4 mt-4 rounded-md shadow-md">
        <div className="flex items-center space-x-4 mb-4">
          <div>
            <p className="text-xl font-bold">{user.username}</p>
            <p>Member since: {user.memberSince}</p>
            <p>Reputation: {user.reputation}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">My Questions</h3>
          <ul>
            {user.questions.map((question) => (
              <li key={question.id} className="mb-2">
                <a
                  href={`/questions/${question.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {question.title}
                </a>
                <button
                  className="ml-2 text-sm text-gray-500"
                  onClick={() => editQuestion(question.id)}
                >
                  Edit
                </button>
                <button
                  className="ml-2 text-sm text-red-500"
                  onClick={() => deleteQuestion(question.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">My Tags</h3>
          <ul>
            {user.tags.map((tag) => (
              <li key={tag.id} className="mb-2">
                <span>{tag.name}</span>
                {tag.editable && (
                  <>
                    <button
                      className="ml-2 text-sm text-gray-500"
                      onClick={() => editTag(tag.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="ml-2 text-sm text-red-500"
                      onClick={() => deleteTag(tag.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">Questions I've Answered</h3>
          <ul>
            {user.answeredQuestions.map((answeredQuestion) => (
              <li key={answeredQuestion.id} className="mb-2">
                <a
                  href={`/questions/${answeredQuestion.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {answeredQuestion.title}
                </a>
                {/* Display user's answer */}
                <button
                  className="ml-2 text-sm text-gray-500"
                  onClick={() => editAnswer(answeredQuestion.id)}
                >
                  Edit Answer
                </button>
                <button
                  className="ml-2 text-sm text-red-500"
                  onClick={() => deleteAnswer(answeredQuestion.id)}
                >
                  Delete Answer
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
