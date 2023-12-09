import React, { useEffect, useState } from 'react';
import axios from 'axios';
import HeaderBar from './headerbar.js';
import Main from './main.js';
import SideBar from './sidebar.js';
import SubHeader from './subheader.js';
import { sortByTime, sortByAnswered, sortByUnAnswered } from '../sort.js';

export default function FakeStackOverFlow() {
  const [search, setSearch] = useState("");
  const [sortAndPage, setSortAndPage] = useState({ sortMethod: "newest-btn", page: "question-page" });
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currQuestionId, setCurrQuestionId] = useState(null);
  const [data, setData] = useState([]);
  const [dataNotChanging, setDataNotChanging] = useState([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    axios.get('http://localhost:8000/get/questions')
      .then(response => {
        const fetchedQuestions = response.data;
        setData(fetchedQuestions.sort(sortByTime()));
        setDataNotChanging(fetchedQuestions.sort(sortByTime()));
        setNumQuestions(fetchedQuestions.length);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }, []);

  useEffect(() => {
    if (sortAndPage.page === 'question-page' && sortAndPage.sortMethod !== 'unchanged') {
      setCurrentQuestion(null);
      axios.get('http://localhost:8000/get/questions')
      .then(response => {
        const fetchedQuestions = response.data;
        setData(fetchedQuestions.sort(sortByTime()));
        setDataNotChanging(fetchedQuestions.sort(sortByTime()));
        setNumQuestions(fetchedQuestions.length);
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
    }
  }, [sortAndPage]);

  useEffect(() => {
    let dataClone = [...dataNotChanging];
    if(sortAndPage.page === 'question-page'){
      if(sortAndPage.sortMethod === 'newest-btn'){
        dataClone.sort(sortByTime());
        setData(dataClone);
      }else if(sortAndPage.sortMethod === 'answered-btn'){
        dataClone.sort(sortByAnswered(dataClone));
        setData(dataClone);
      }else if(sortAndPage.sortMethod === 'unanswered-btn'){
        setData(dataClone.filter(a => sortByUnAnswered()(a)));
      }else if(sortAndPage.sortMethod === 'unchanged'){
        // come back to question page but not doing anything
      }
    }
  }, [sortAndPage,dataNotChanging])

  useEffect(() => {
    setNumQuestions(data.length);
  }, [data]);

  function handleInputChange(e) {
    setSearch(e.target.value);
    if(e.key === 'Enter'){
      // if the search input is empty, set the data to the original data
      // else, filter the data based on the search input and tags

      // filter the data based on the search input and tags
      let dataClone = [...dataNotChanging];
      if(e.target.value !== ''){
        const keywords = scanKeyWords(e.target.value); // should have an array of keywords. Now find the questions in the database to match these keywords
        const tagsKeyword = keywords.filter(a => a[0] === true).map(a => a[1]); // separate tag keyword into one array and remove the boolean flag(a[0])
        const normalKeyword = keywords.filter(a => a[0] === false).map(a => a[1]); // separate normal keyword into one array and remove the boolean flag(a[0])
        const filtered = dataClone.filter(a => {
          for(const i in a.tags){
            for(const j in tagsKeyword){
              if(a.tags[i].name.toLowerCase().includes(tagsKeyword[j])){
                return true;
              }
            }
          }
          for(const j in normalKeyword){
            if(a.text.toLowerCase().includes(normalKeyword[j])){
              return true;
            }else if(a.title.toLowerCase().includes(normalKeyword[j])){
              return true;
            }
          }
          return false;
        });
        setData(filtered);
      }
      else{
        setData(dataClone);
      }
      setCurrentQuestion(null);
      setSearch(e.target.value);
      setSortAndPage({
        sortMethod: 'unchanged',
        page: 'question-page'
      });
    }
  }
  

  const handleSort = (e) => {
    const buttonId = e.target.id;
    console.log(e.target.id);
    if (buttonId === 'login-btn') {
      
      setSortAndPage({
        sortMethod: buttonId,
        page: "login"
      });

    } else if (buttonId === 'signup-btn') {

      setSortAndPage({
        sortMethod: buttonId,
        page: "signup"
      });

    } else {
      setSortAndPage({
        sortMethod: buttonId,
        page: "question-page"
      });
    }
  }
  

  function handlePageChange(e) {
    setCurrentQuestion(null);
    if(e.questionId){
      setCurrQuestionId(e.questionId);
    }
    if(e.id){
      setUserId(e.id);
    }else{
      setUserId("");
    }
    setSortAndPage({
      sortMethod: e.target.id === 'question-page' ? 'newest-btn' : sortAndPage.sortMethod,
      page: e.target.id
    });
  }

  function handleQuestionClick(qid) {
    const q = data.filter(a => a._id.toString() === qid);
    axios.post(`http://localhost:8000/post/questions/updateview/${qid}`,{
      views: q.views+1
    })
      .then(response => {
        setCurrQuestionId(qid);
        setCurrentQuestion(q[0].title);
        setNumQuestions(Object.keys(q[0]['answers']).length);
        setSortAndPage({
          ...sortAndPage,
          page: 'detail'
        });
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
      });
  }

  function handleDataUpdate(newData) {
    setData(newData);
  }

  function backToQuestions() {
    setSortAndPage({
      sortMethod: 'newest-btn',
      page: 'question-page'
    });
  }

  function backToQuestionsFromTags() {
    setSortAndPage({
      sortMethod: 'unchanged',
      page: 'question-page'
    });
  }

  return (
    <>
      <HeaderBar search={handleInputChange} searchValue={search} handleSort={handleSort} />
      <div className="flex h-screen">
        <SideBar handlePageChange={handlePageChange} />
        <div id="complete-main" className="basis-5/6 mt-4">
          <SubHeader currentPage={sortAndPage} currentQuestion={currentQuestion} handlePageChange={handlePageChange} numQuestions={numQuestions} />
          <Main data={data} searchValue={search} sortAndPage={sortAndPage} onQuestionClick={handleQuestionClick} currentQuestion={currentQuestion} postQuestion={handleDataUpdate}
                backToQuestions={backToQuestions} handlePageChange={handlePageChange} postAnswer={handleDataUpdate} handleInputChange={handleInputChange} backToQuestionsFromTags={backToQuestionsFromTags} 
                currQuestionId={currQuestionId} userId = {userId}/>
        </div>
      </div>
    </>
  );
}

/**
 * This function will read through a string and process the strings into separate keywords
 * marking the tag keywords vs the text keywords.
 * 
 * @param {String} input 
 * @returns An 2d array with each entry being [boolean][string] -> boolean true if tag false if text.
 */
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