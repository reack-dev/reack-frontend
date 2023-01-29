import './App.css';
import React, { useState, useEffect, Component } from 'react';
import useWebSocket from 'react-use-websocket';
import ReactJson from 'react-json-view'

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
    <div>
      <header>
        <h1>RBin</h1> 
        <button type="button" onClick={generateNewUrl}>Generate New URL</button> 
         <div className="full_url">{activeURLFull}</div>
      </header>
      <body>
        <div className="row">
          <div className="left"><UrlList urls={currentURLs} activeURL={activeURL} selectURL={selectURL} /></div>
          <div className="middle"><RequestList requests={currentRequestList} currentRequestID={currentRequestID} selectRequest={selectRequest} /></div>
          <div className="right"><RequestBody requestInfo={currentRequest}/></div>
        </div>
      </body>
    </div>
  );
}

const UrlList = ({ urls, activeURL, selectURL }) => {
  return (<div>
    <h3>Active URLs</h3>
    <ul>
      {urls.map(function(obj, index) {
        return <UrlItem obj={obj} id={index} selectURL={selectURL} activeURL={activeURL} />
      })}
    </ul>
    </div>); // Iterate through array of URL items, display key components of each one 
}

function UrlItem({ obj, index, selectURL, activeURL }) {
  if (activeURL == obj.randomString) { // display highlighted URL if its the selected one one 
    return (<li index={index} onClick={() => selectURL(obj.randomString)} className="highlight_request_li">
    {obj.randomString}
    </li>); 
  }
  return (<li index={index} onClick={() => selectURL(obj.randomString)} className="request_li">
    {obj.randomString}
    </li>); // Display each url item
}

function RequestList({ requests, currentRequestID, selectRequest }) {
  return (<div>
    <h3>Requests</h3>
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
      <h3>Request Body</h3>
      <ul id="request_details">
        <ReactJson src={requestInfo} />
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

function RequestLine({ line }) {
  return (<li> {line} </li>)
}

export default App;
