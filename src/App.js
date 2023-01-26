import './App.css';
import React, { useState, useEffect, Component } from 'react';
import useWebSocket from 'react-use-websocket';

function App() {
  let firstRequest = {
    id: 1,
    method: "POST",
    host: "hostst",
    path: "/1",
    headers: {
      "Content type": "applicaiton/json",
    },
    body: { 
      "some data here": "some other data here",
      "some more data here": "even more data here",
    },
    createdAt: "1 2023-01-25T23:34:58.228Z",
  }
  
  let secondRequest = {
    id: 2,
    method: "POST",
    host: "host2",
    path: "/2",
    headers: {
      "Content type": "applicaiton/json",
    },
    body: { 
      "some data here2": "some other data here2",
      "some more data here2": "even more data here2",
    },
    createdAt: "2 2022-01-25T23:34:58.228Z",
  }
  
  let thirdRequest = {
    id: 3,
    method: "POST",
    host: "hos3",
    path: "/3",
    headers: {
     "Content type": "applicaiton/json",
    },
    body: { 
      "some data here3": "some other data here3",
      "some more data here3": "even more data here3",
    },
    createdAt: "3 2021-01-25T23:34:58.228Z",
  }
  
  let firstURL = {
    randomString: "1a2s3d4f",
    requests: [firstRequest]
  }
  
  let secondURL = {
    randomString: "4f5g6h7j",
    requests: [secondRequest, thirdRequest]
  }

  let urlItems = [firstURL, secondURL];

  const [currentURLs, setCurrentURLs] = useState(urlItems) // change to empty array to get rid of dummy data
  const [activeURL, setActiveURL] = useState("")
  const [currentRequestList, setRequestList] = useState([])
  const [currentRequest, setCurrentRequest] = useState([])

  const WS_URL = 'ws://127.0.0.1:3000';

  const { sendMessage } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('connection established!');
    },

    onMessage: (msg) => {
      setRequestList([msg.data, ...currentRequestList]);
    }
  })

  const selectURL = (randomString) => {
    //let newUrlObj = GetRequestsByURL(randomString) // query server to get new URL object
    //setRequestList(newUrlObj.requests) 
    setActiveURL(randomString)
    
    if (randomString == "1a2s3d4f") { // delete this conditional once you delete dummy data
      setRequestList(firstURL.requests);
    } else if (randomString == "4f5g6h7j") {
      setRequestList(secondURL.requests);
    } else {
      setRequestList([])
    }
    
  }

  function GetRequestsByURL(randomString) { // get new URL from express app 1, add it to the array of current URLs
      
  }

  const selectRequest = (request) => {
    let bodyArr = formatBody(request.body);
    setCurrentRequest(bodyArr);
  }

  const formatBody = (bodyObj) => {
   // bodyObj = JSON.stringify(bodyObj)
    let newArr = []
    for (let key in bodyObj) {
      newArr.push(key + " : " + bodyObj[key])
    }
    return newArr
  } // should return string containing body object
  
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
      </header>
      <body>
        <div className="row">
          <div className="left"><UrlList urls={currentURLs} activeURL={activeURL} selectURL={selectURL} /></div>
          <div className="middle"><RequestList requests={currentRequestList} currentRequest={currentRequest} selectRequest={selectRequest} /></div>
          <div className="right"><RequestBody requestInfo={currentRequest}/></div>
        </div>
      </body>
    </div>
  );
}

const UrlList = ({ urls, activeURL, selectURL }) => {
  return (<div>
    <h3>List for URLs</h3>
    <ul>
      {urls.map(function(obj, index) {
        return <UrlItem obj={obj} index={index} selectURL={selectURL} activeURL={activeURL} />
      })}
    </ul>
    </div>); // Iterate through array of URL items, display key components of each one 
}

function UrlItem({ obj, index, selectURL, activeURL }) {
  return (<li index={index} onClick={() => selectURL(obj.randomString)} className="request_li">
    {obj.randomString}
    </li>); // Display each url item
}

function RequestList({ requests, currentRequest, selectRequest }) {
  return (<div>
    <h3>List for Requests</h3>
    <ul>
      {requests.map(function(requestObj, index) {
        return <RequestItem requestObj={requestObj} index={requestObj.id} selectRequest={selectRequest} currentRequest={currentRequest} />
      })}
    </ul>
    </div>); // Iterate through array of request items, display key components of each one 
}

function RequestItem({ requestObj, index, selectRequest, currentRequest }) {
  return (<li index={index} onClick={() => selectRequest(requestObj)} className="request_li" >
    HTTP {requestObj.method} {requestObj.path} {requestObj.createdAt}
    </li>); // Display each request item
}

function RequestBody({ requestInfo }) {
  return (<div>
    <h3>Body of Request</h3>
    <ul id="request_details">
      {requestInfo.map(function(line, index) { return <RequestLine line={line} /> })}
    </ul>
  </div>); // display body of request 
}

function RequestLine({ line }) {
  return (<li> {line} </li>)
}

export default App;
