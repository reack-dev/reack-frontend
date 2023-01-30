import './App.css';
import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { JsonViewer } from '@textea/json-viewer'

const Title = ({ title }) => <h3 className="font-bold px-2 py-2">{title}</h3>;
const ItemActive = ({ text, onClick }) => <li className="text-white bg-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={onClick}>{text}</li>;
const Item = ({ text, onClick }) => <li className="border-2 border-sky-700 hover:bg-sky-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2" onClick={onClick} >{text}</li>

function App() {
  const [currentURLs, setCurrentURLs] = useState([]) // change to empty array to get rid of dummy data
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
      setRequestList([JSON.parse(msg.data), ...currentRequestList]);
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
    //let bodyArr = formatBody(request);
    setCurrentRequest(request);
    setCurrentRequestID(request.id)
  }

  // const formatBody = (bodyObj) => {
  //    bodyObj = JSON.stringify(bodyObj, null, 5)
  //   // let newArr = []
  //   // for (let key in bodyObj) {
  //   //   if (typeof key == "object") {
  //   //     for (let key2 in bodyObj[key]) {
  //   //       newArr.push("  " + key2 + " : " + bodyObj[key][key2])
  //   //     }
  //   //   }
  //   //   newArr.push(key + " : " + bodyObj[key])
  //   // }
  //   return bodyObj
  // } // should return string containing body object

  //obj = formatBody(obj)
  
  const generateNewUrl = () => {
    fetch("http://localhost:3000/generateURL")
      .then((res) => res.json())
      .then((data) => {
        setCurrentURLs([data, ...currentURLs]);
        sendMessage(data.randomString)
      });
  }
  
  return (
    <div className="container mx-auto py-4">
      <header>
        <h1 className="text-3xl font-bold py-6">ReAct</h1> 
        <button className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2" type="button" onClick={generateNewUrl}>Generate New URL</button> 
         <div className="full_url">{activeURLFull}</div>
      </header>
      <main>
        <div className="flex h-screen">
          <div className="w-1/4 h-full border-2"><UrlList urls={currentURLs} activeURL={activeURL} selectURL={selectURL} /></div>
          <div className="w-1/4 h-full border-2"><RequestList requests={currentRequestList} currentRequestID={currentRequestID} selectRequest={selectRequest} /></div>
          <div className="w-2/4 h-full border-2"><RequestBody requestInfo={currentRequest}/></div>
        </div>
      </main>
    </div>
  );
}

const UrlList = ({ urls, activeURL, selectURL }) => {
  return (<div>
    <Title title="Active URLs" />
    <ul>
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
  return (<div>
    <Title title="Requests" />
    <ul>
      {requests.map(function(requestObj, index) {
        return <RequestItem requestObj={requestObj} id={requestObj.id} selectRequest={selectRequest} currentRequestID={currentRequestID} />
      })}
    </ul>
    </div>); // Iterate through array of request items, display key components of each one 
}

function RequestItem({ requestObj, id, selectRequest, currentRequestID }) {
    let time = requestObj.createdAt.slice(14, 22) // slice correct time from request 
 
    if (requestObj.id == currentRequestID) { // display highlighted URL if its the selected one one 
      return (<li index={id} onClick={() => selectRequest(requestObj)} className="highlight_request_li" >
      HTTP {requestObj.method} {requestObj.path} {time}
      </li>);
    }
    return (<li index={id} onClick={() => selectRequest(requestObj)} className="request_li" >
      HTTP {requestObj.method} {requestObj.path} {time}
    </li>); // Display each request item
}

function RequestBody({ requestInfo }) {
  if (requestInfo !== null) {
    return (<div>
      <Title title="Request Body" />
      <ul id="request_details">
        <JsonViewer value={requestInfo} />
      </ul>
    </div>);
  } else {
    return (<div>
      <h3>Request Body</h3>
      <ul id="request_details">
       
      </ul>
    </div>);
  }
   // display body of request 
}

// function RequestLine({ line }) {
//   return (<li> {line} </li>)
// }

export default App;
