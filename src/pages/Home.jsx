import { Configuration, OpenAIApi } from "openai";
import "./home.css";
import Bot from "../assets/bot.svg";
import User from "../assets/user.svg";
import Logo from "../assets/Logo.png";
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';



const configuration = new Configuration({
  apiKey: process.env.REACT_APP_API_KEY
});


const openai = new OpenAIApi(configuration);

const renderers = {
  code: ({ language, value, isInline }) => {
    return (
      <SyntaxHighlighter
        style={docco}
        language={language}
        children={value}
        customStyle={{
          borderRadius: '5px',
          padding: isInline ? '0' : '1em',
          overflowX: 'auto',
        }}
        lineNumberStyle={{ color: 'white' }}
        showLineNumbers={!isInline}
        PreTag={isInline ? 'span' : 'pre'}
      />
    );
  },
  codeBlock: ({ language, value }) => {
    return (
      <SyntaxHighlighter
        style={docco}
        language={language}
        children={value}
        customStyle={{ borderRadius: '5px', padding: '1em', overflowX: 'auto' }}
        lineNumberStyle={{ color: 'white' }}
        showLineNumbers
      />
    );
  },
};

function InputForm({ handleSubmit, inputValue, setInputValue }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="inputPromptWrapper">
        <input
          name="inputPrompt"
          className="inputPromptTextarea textarea"
          type="text"
          placeholder="Enter your Name or Type Start to Begin"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          aria-label="form submit"
          type="submit"
          className="buttoncolor"
        >
          <svg
            fill="#FFFFFF"
            width="15"
            height="20"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#FFFFFF"
            strokeWidth="0"
          >
            <title>submit form</title>
            <path
              d="m30.669 1.665-.014-.019a.73.73 0 0 0-.16-.21h-.001c-.013-.011-.032-.005-.046-.015-.02-.016-.028-.041-.05-.055a.713.713 0 0 0-.374-.106l-.05.002h.002a.628.628 0 0 0-.095.024l.005-.001a.76.76 0 0 0-.264.067l.005-.002-27.999 16a.753.753 0 0 0 .053 1.331l.005.002 9.564 4.414v6.904a.75.75 0 0 0 1.164.625l-.003.002 6.259-4.106 9.015 4.161c.092.043.2.068.314.068H28a.75.75 0 0 0 .747-.695v-.002l2-27.999c.001-.014-.008-.025-.008-.039l.001-.032a.739.739 0 0 0-.073-.322l.002.004zm-4.174 3.202-14.716 16.82-8.143-3.758zM12.75 28.611v-4.823l4.315 1.992zm14.58.254-8.32-3.841c-.024-.015-.038-.042-.064-.054l-5.722-2.656 15.87-18.139z"
              stroke="none"
            ></path>
          </svg>
          </button>
      </div>
    </form>
  );
}


function ChatHistory({ inputValues, responses }) {
  const [displayedResponses, setDisplayedResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (responses.length > 0) {
      setIsLoading(true);
      typeWriter(responses[responses.length - 1]);
    }
  }, [responses]);

  function typeWriter(txt) {
    let i = 0;
    const speed = 20;
    const updatedResponses = [...displayedResponses, ""];

    function type() {
      if (i < txt.length) {
        updatedResponses[updatedResponses.length - 1] += txt.charAt(i);
        setDisplayedResponses([...updatedResponses]);
        i++;
        setTimeout(type, speed);
      } else {
        setIsLoading(false);
      }
    }

    type();
  }

  const loadingDots = <span className="loadingDots">...</span>;
  return (
    <div id="chat_container">
  <div className="cente">
    <div className="conte"></div>

    {inputValues.map((inputValue, index) => (
      <div key={`input-${index}`} className="cent">
        <div className="input-row">
          <img src={User} alt="send" className="ico" />
          <ReactMarkdown
            renderers={renderers}
            children={inputValue}
            className="input-response"
          />
        </div>
        {responses[index] && (
          <div key={`response-${index}`} className="response-row">
            <img src={Bot} alt="send" className="ico" />
            {index === inputValues.length - 1 && isLoading && loadingDots}
            <ReactMarkdown
              renderers={renderers}
              children={
                index === inputValues.length - 1
                  ? displayedResponses[index]
                  : responses[index]
              }
              id={`response-${index}`}
              className="bot-response"
            />
          </div>
        )}
      </div>
    ))}
  </div>
</div>

  );
  }
  
  function Home() {
    const [inputValue, setInputValue] = useState("");
    const [inputValues, setInputValues] = useState([]);
    const [responses, setResponses] = useState([]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      setInputValues([...inputValues, inputValue]);
  
      const chapGPT = async (prompt, context) => {
        const messageHistory = [
          { role: "system", content: "You are a general AI assistants who is great at generating contents for digital marketing and great full stack developer and everything general, your response must always be returned in markdown" },
          ...context.map((message) => ({ role: "user", content: message })),
          { role: "user", content: prompt },
        ];
  
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messageHistory,
          max_tokens: 2048
        });
  
        setResponses([
          ...responses,
          response["data"]["choices"][0]["message"]["content"]
        ]);
      };
  
      const recentContext = inputValues.slice(-2);
      chapGPT(inputValue, recentContext);
      setInputValue("");
    };
  
    return (
      <div className="home-container">
        <div data-role="Header" className="home-header-container">
          <header className="home-header">
            <div className="home-logo">
              <img alt="image" src={Logo} className="home-image" />
            </div>
          </header>
        </div>
        <main className="home-main">
          <div className="home-container1">
            <h2 className="home-text Headline2">Genius AI</h2>
            <p className="home-text1">
            Meet Genius AI, the AI-powered hero that will revolutionize the way you create digital marketing content. With ChatGPT, you can expect exceptional quality, engagement, and efficiency. Say goodbye to mediocre content and hello to Genius AI.
            </p>
          </div>
          <div className="home-container2">
            <ChatHistory
              inputValues={inputValues}
              responses={responses}
            />
            <InputForm
              handleSubmit={handleSubmit}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </div>
        </main>
        <footer className="home-footer">
          <footer className="home-container3">
            <div className="home-divider"></div>
            <div className="home-container4">
              <span className="home-text2 Body2">
                © 2023 Genius AI, Develop by <a href="https://www.fiverr.com/s/3RRwkL">Jogenius</a>
              </span>
            </div>
        </footer>
      </footer>
    </div>
  );
}

export default Home;
