import './App.css';
import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { JsonViewer } from '@textea/json-viewer'
import toast, { Toaster } from 'react-hot-toast';

const Title = ({ title }) => <h3 className="font-bold px-2 py-2">{title}</h3>;
const ItemActive = ({ text, onClick }) => <li className="text-white border-4 border-orange-700 bg-orange-700 hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={onClick}>{text}</li>;
const Item = ({ text, onClick }) => <li className="border-4 border-orange-700 hover:bg-orange-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={onClick} >{text}</li>;
const Spin = () => {
  return (
    <div className="mx-2 m-2">
      <svg class="animate-spin -ml-1 mr-3 h-6 w-6 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Waiting for requests...
    </div>
  );
}
const Description = () => {
  return (
    <div className="grid place-items-center w-full h-128 border-2 border-dashed">
      <div className="flex w-2/5 py-32 inline">
        <div>
          <svg className="w-20" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M27.2529 43.1797C26.7195 43.5379 26.2182 43.9491 25.7573 44.41L19.88 50.2869C17.7074 52.4593 16.9714 55.6843 17.9863 58.5842L21.5086 68.6478C21.8253 69.5526 22.9787 69.8156 23.6562 69.1375L23.6589 69.1348L32.6721 60.1223L27.7383 44.8512C27.5597 44.2985 27.3979 43.741 27.2529 43.1797ZM47.8214 60.6162L56.3425 69.1372C57.021 69.8158 58.1755 69.5523 58.4925 68.6466L62.0135 58.5865C63.0288 55.6858 62.2926 52.4599 60.1195 50.2868L54.243 44.4103C53.9433 44.1106 53.6265 43.8319 53.295 43.5751C53.1781 44.003 53.0513 44.4285 52.9147 44.8512L47.8214 60.6162Z" fill="#F2C94C" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M40.0738 10.6969C40.219 10.5724 40.4333 10.5724 40.5785 10.6969L44.1462 13.7549C50.6075 19.2932 54.3262 27.3783 54.3262 35.8883C54.3262 38.9311 53.8498 41.955 52.9144 44.8504L46.1106 65.9096C46.0007 66.25 45.6838 66.4806 45.3262 66.4806H35.3262C34.9685 66.4806 34.6517 66.25 34.5417 65.9096L27.738 44.8504C26.8025 41.955 26.3262 38.9311 26.3262 35.8883C26.3262 27.3783 30.0448 19.2932 36.5061 13.7549L40.0738 10.6969Z" fill="#EB5757" />
            <path d="M37.7281 25.9805C39.3358 25.0523 41.3166 25.0523 42.9242 25.9805C44.5319 26.9087 45.5223 28.6241 45.5223 30.4805C45.5223 32.3369 44.5319 34.0523 42.9242 34.9805C41.3166 35.9087 39.3358 35.9087 37.7281 34.9805C36.1204 34.0523 35.13 32.3369 35.13 30.4805C35.13 28.6241 36.1204 26.9087 37.7281 25.9805Z" fill="#F2F2F2" />
          </svg>
        </div>
        <div className="inline">
          <p className="font-bold">You don't have any bins, yet.</p>
          <p>Click "Generate New URL" to get your first bin and start receiving requests!</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  const localhost = {
    randomString: 'localhost',
    requests: [],
  }

  const [currentURLs, setCurrentURLs] = useState([localhost]) // change to empty array to get rid of dummy data
  const [activeURL, setActiveURL] = useState("")
  const [activeURLFull, setActiveURLFull] = useState("Your selected URL will appear here")
  const [currentRequestList, setRequestList] = useState([])
  const [currentRequest, setCurrentRequest] = useState(null)
  const [currentRequestID, setCurrentRequestID] = useState("")

  const WS_URL = 'ws://localhost:3000/';

  const { sendMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('connection established!');
    },

    onMessage: (msg) => {
      const msgJSON = JSON.parse(msg.data);
      setRequestList([msgJSON, ...currentRequestList]);
      toast(`New request received on bin ${msgJSON.randomURL}`);
    }
  })

  const selectURL = (randomString) => {
    fetch(`http://localhost:3000/display/${randomString}`)
      .then((res) => res.json())
      .then((data) => setRequestList(data.requests));
    setActiveURL(randomString)
    setActiveURLFull("Currently selected URL endpoint: https://" + randomString + ".kush.chris.connor.maxamoretti.com/")    
    setCurrentRequest(null)
  }

  const selectRequest = (request) => {
    setCurrentRequest(request);
    setCurrentRequestID(request.id)
  }
  
  const generateNewUrl = () => {
    fetch("http://localhost:3000/generateURL")
      .then((res) => res.json())
      .then((data) => {
        setCurrentURLs([data, ...currentURLs]);
        setActiveURL(data.randomString);
        sendMessage(data.randomString)
        toast(`New URL generated`);
      });
  }

  const Main = () => {
    if (currentURLs.length === 0) return <Description />

    return (
      <div className="flex h-screen gap-2">
        <div className="w-1/5 h-full"><UrlList urls={currentURLs} activeURL={activeURL} selectURL={selectURL} /></div>
        <div className="w-1/5 h-full"><RequestList requests={currentRequestList} currentRequestID={currentRequestID} selectRequest={selectRequest} /></div>
        <div className="w-3/5 h-full"><RequestBody requestInfo={currentRequest}/></div>
      </div>
    )
  }
  
  return (
    <div className="bg-slate-300 h-screen">
      <Toaster />
      <div className="container mx-auto py-4">
        <header>
          <h1 className="text-3xl font-bold py-6"><img className="w-11 h-11 mr-2 inline" src="https://openmoji.org/data/color/svg/1F4E6.svg"></img>ReAck</h1> 
          <button className="transition ease-in-out duration-500 text-white bg-blue-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-4" type="button" onClick={generateNewUrl}>Generate New URL</button> 
          <div className="full_url">{activeURLFull}</div>
        </header>
        <Main />
      </div>
    </div>
  );
}

const UrlList = ({ urls, activeURL, selectURL }) => {
  return (<div>
    <Title title="Active URLs" />
    <ul className="mx-2 my-2">
      {urls.map(function(obj, index) {
        return <UrlItem obj={obj} id={index} key={index} selectURL={selectURL} activeURL={activeURL} />
      })}
    </ul>
    </div>); // Iterate through array of URL items, display key components of each one 
}

function UrlItem({ obj, index, selectURL, activeURL }) {
  if (activeURL == obj.randomString) { // display highlighted URL if its the selected one one 
    return <ItemActive index={index} text={obj.randomString} onClick={() => selectURL(obj.randomString)}/> 
  }
  return <Item index={index} text={obj.randomString} onClick={() => selectURL(obj.randomString)}/> 
}

function RequestList({ requests, currentRequestID, selectRequest }) {
  if (requests.length == 0) {
    return <><Spin /></>;
  }
  return (<div>
    <Title title="Requests" />
    <ul className="mx-2 my-2">
      {requests.map(function(requestObj) {
        return <RequestItem requestObj={requestObj} key={requestObj.id} selectRequest={selectRequest} currentRequestID={currentRequestID} />
      })}
    </ul>
    </div>);
}

function RequestItem({ requestObj, selectRequest, currentRequestID }) {
    let time = requestObj.createdAt.slice(14, 22) // slice correct time from request
    const text = `HTTP ${requestObj.method} ${requestObj.path} ${time}`
 
    if (requestObj.id == currentRequestID) { // display highlighted URL if its the selected one one 
      return <ItemActive text={text} onClick={() => selectRequest(requestObj)}/>
    }
    return  <Item text={text} onClick={() => selectRequest(requestObj)}/>
}

function RequestBody({ requestInfo }) {
  if (requestInfo !== null) {
    return (<div>
      <Title title="Request Body" />
      <ul id="request_details">
        <JsonViewer value={requestInfo} />
      </ul>
    </div>);
  }
   // display body of request 
}

export default App;
