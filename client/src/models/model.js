export default class Model {
  constructor() {
    this.data = {
      questions: [
                  {
                    qid: 'q1',
                    title: 'Programmatically navigate using React router',
                    text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
                    tagIds: ['t1', 't2'],
                    askedBy : 'JoJi John',
                    askDate: new Date('December 17, 2020 03:24:00'),
                    ansIds: ['a1'],
                    views: 10,
                  },
                  {
                    qid: 'q2',
                    title: 'android studio save string shared preference, start activity and load the saved string',
                    text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
                    tagIds: ['t3', 't4', 't2'],
                    askedBy : 'saltyPeter',
                    askDate: new Date('January 01, 2022 21:06:12'),
                    ansIds: ['a6'],
                    views: 121,
                  },
                  {
                    qid : 'q3',
                    title: 'react doens\'t work',
                    text: '???',
                    askedBy : 'angryProgammer',
                    askDate: new Date('January 01, 2023 21:06:12'),
                    views: 0,
                    ansIds: ["a2"],
                    tagIds: ['t1']
                  }
                ],
      tags: [
        {
          tid: 't1',
          name: 'react',
        },
        {
          tid: 't2',
          name: 'javascript',
        },
        {
          tid: 't3',
          name: 'android-studio',
        },
        {
          tid: 't4',
          name: 'shared-preferences',
        }
      ],

      answers: [
        {
          aid: 'a1',
          text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.',
          ansBy: 'hamkalo',
          ansDate: new Date('March 02, 2022 15:30:00'),
        },
        {
          aid: 'a2',
          text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.',
          ansBy: 'azad',
          ansDate: new Date('January 31, 2022 15:30:00'),
        },
        {
          aid: 'a3',
          text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.',
          ansBy: 'abaya',
          ansDate: new Date('April 21, 2022 15:25:22'),
        },
        {
          aid: 'a4',
          text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);',
          ansBy: 'alia',
          ansDate: new Date('December 02, 2022 02:20:59'),
        },
        {
          aid: 'a5',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansDate: new Date('December 31, 2022 20:20:59'),
        },
        {
          aid: 'a6',
          text: 'I just found all the above examples just too confusing, so I wrote my own. ',
          ansBy: 'sana',
          ansDate: new Date('September 30, 2023 20:20:59'),
        }
      ]
    };
  }
  // add methods to query, insert, and update the model here. E.g.,
  // getAllQstns() {
  //   return this.data.questions;
  // }

  insertQuestion(question){
    /*
      question : {
        title;
        text;
        tag[];
        username;
      }
    */

    //extract
    let nqid = this.data["questions"].length + 1;
    let existingTags = new Set();
    for(let i = 0; i < this.data.tags.length;i++){
      existingTags.add(this.data.tags[i].name);
    }
    let nonduplicates = [];
    for(let i= 0; i< question.tag.length; i++){
      if(!existingTags.has(question.tag[i])) nonduplicates.push(question.tag[i]);
    }
    this.insertTags(nonduplicates);
    let tagIdString = [];
    for(let i = 0; i < this.data.tags.length; i++){
      if(question.tag.includes(this.data.tags[i].name)){
        tagIdString.push(this.data.tags[i].tid);
      }
    }
    let questionModel = {
      qid : `q${nqid}`,
      title : question.title,
      text : question.text,
      tagIds : tagIdString,
      askedBy : question.username,
      askDate : new Date(),
      ansIds: [],
      views: 0 // check if this should be initialized to 0 or
    };

    this.data.questions.push(questionModel);
  }

  updateView(questionId){
    for(let i  = 0; i < this.data.questions.length;i++){
      if(this.data.questions[i].qid === questionId){
        this.data.questions[i].views += 1;
      }
    }
  }

  insertAnswer(answer){
    /**
     * ans : {
     *  qid,
     *  text,
     *  ansBy,
     * }
    */
    let aidLen = this.data.answers.length + 1;
    this.data.answers.push({
      aid : `a${aidLen}`,
      text : answer.text,
      ansBy : answer.ansBy,
      ansDate : new Date()
    }) // upload new answer into data

    for(let i = 0; i < this.data.questions.length;i++){
      if(this.data.questions[i].qid === answer.qid){
        this.data.questions[i].ansIds.push(`a${aidLen}`);
      }
    }
  }

  insertTags(tags){
    let tagsLen = this.data.tags.length + 1;
    let counter = tagsLen;
    for(let i = 0; i < tags.length; i++){
      let tag  = {
        tid : `t${counter}`,
        name: tags[i]
      }
      counter+=1;
      this.data.tags.push(tag)
    }
    //return [tagsLen, tagsLen + tags.length]; // the range of tagids added
  }
  
  getAllQstns() {
    return this.data.questions;
  }

  getAllTags(){
    return this.data.tags;
  }

  getAllAnswers(){
    return this.data.answers;
  }
}
