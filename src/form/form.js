import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

function Form() {
  const URL = 'https://opentdb.com/api.php';
  const [count, setCount] = useState(10);
  const [categoryId, setCategoryId] = useState('any');
  const [difficulty, setDifficulty] = useState('any');
  const [type, setType] = useState('any');
  const [results, setResults] = useState({ id: '', questions: [] });

  // https://opentdb.com/api.php?amount=10&category=17&difficulty=medium&type=multiple

  function categoryIdIsOk() {
    if (categoryId === 'any') {
      return false;
    }

    const numberValue = Number(categoryId);

    if (!isNaN(numberValue) && numberValue >= 9 && numberValue <= 32) {
      return true;
    }

    return false;
  }

  function difficultyIsOk() {
    return ['easy', 'medium', 'hard'].includes(difficulty);
  }

  function typeisOk() {
    return ['boolean', 'multiple'].includes(type);
  }

  function makeGameQuery() {
    let params = '';

    params += count > 0 && count < 51 ? `?amount=${count}` : ``;
    params += categoryIdIsOk() ? `&category=${categoryId}` : ``;
    params += difficultyIsOk() ? `&difficulty=${difficulty}` : ``;
    params += typeisOk() ? `&type=${type}` : ``;

    return URL + params;
  }

  function getQuestions() {
    const gameQuery = makeGameQuery();

    fetch(gameQuery)
      .then((response) => response.json())
      .then((data) => {
        if (data['response_code'] !== 0) {
          const badResponse = {
            id: 'ERROR',
            questions: [
              {
                category: 'ERROR',
                type: 'ERROR',
                difficulty: 'ERROR',
                question: 'ERROR',
                answers: ['ERROR'],
              },
            ],
          };
          setResults(badResponse);
        }
        const tempResults = { ...results };
        tempResults.id = uuidv4();
        tempResults.questions = data['results'];
        setResults(tempResults);
      })
      .catch((error) => setResults(error));
  }
  function showQuestions() {
    return 'We gots questions. Youz got answers';
  }

  return (
    <div>
      <form action="" method="" className="">
        <label htmlFor="trivia_amount">Number of Questions:</label>
        <input
          type="number"
          name="trivia_amount"
          id="trivia_amount"
          className=""
          min="1"
          max="50"
          defaultValue={count}
          onChange={(event) => setCount(event.target.value)}
        />
        <br />

        <label htmlFor="trivia_category">Select Category: </label>
        <select
          name="trivia_category"
          className=""
          onChange={(event) => setCategoryId(event.target.value)}
          defaultValue={categoryId}
        >
          <option value="any">Any Category</option>
          <option value="9">General Knowledge</option>
          <option value="10">Entertainment: Books</option>
          <option value="11">Entertainment: Film</option>
          <option value="12">Entertainment: Music</option>
          <option value="13">Entertainment: Musicals &amp; Theatres</option>
          <option value="14">Entertainment: Television</option>
          <option value="15">Entertainment: Video Games</option>
          <option value="16">Entertainment: Board Games</option>
          <option value="17">Science &amp; Nature</option>
          <option value="18">Science: Computers</option>
          <option value="19">Science: Mathematics</option>
          <option value="20">Mythology</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
          <option value="23">History</option>
          <option value="24">Politics</option>
          <option value="25">Art</option>
          <option value="26">Celebrities</option>
          <option value="27">Animals</option>
          <option value="28">Vehicles</option>
          <option value="29">Entertainment: Comics</option>
          <option value="30">Science: Gadgets</option>
          <option value="31">Entertainment: Japanese Anime &amp; Manga</option>
          <option value="32">
            Entertainment: Cartoon &amp; Animations
          </option>{' '}
        </select>

        <br />

        <label htmlFor="trivia_difficulty">Select Difficulty: </label>
        <select
          name="trivia_difficulty"
          className=""
          defaultValue={difficulty}
          onChange={(event) => setDifficulty(event.target.value)}
        >
          <option value="any">Any Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <br />

        <label htmlFor="trivia_type">Select Type: </label>
        <select
          name="trivia_type"
          className=""
          defaultValue={type}
          onChange={(event) => setType(event.target.value)}
        >
          &gt;
          <option value="any">Any Type</option>
          <option value="multiple">Multiple Choice</option>
          <option value="boolean">True / False</option>
        </select>

        <br />

        <button className="" type="button" onClick={() => getQuestions()}>
          Game On!!
        </button>
      </form>
      <br />
      <br />
      <br />
      <div>
        {results.questions.length > 0 ? showQuestions() : 'Start a game'}
      </div>
    </div>
  );
}

export default Form;
