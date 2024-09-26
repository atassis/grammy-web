import { Bot } from "grammy";
import {ChangeEvent, useCallback, useEffect, useRef, useState} from 'react'
import './App.css'

function evalInContext(js: string, context: unknown) {
  return function () {
    return eval(js);
  }.call(context);
}

const param = 'code';

function getCodeFromQuery(param: string): string {
  const urlParams = new URLSearchParams(window.location.search);
  const value = urlParams.get(param);
  if (value) {
    try {
      return atob(value);
    } catch (e: unknown) {
      console.error(e);
      alert(`Could not parse query param "${param}"!`)
      return '';
    }
  }
  return ''
}

const exampleCode = getCodeFromQuery(param)

function App() {
  const [code, setCode] = useState(exampleCode)

  const runBot = useCallback(() => {
    evalInContext(`const Bot = this.Bot;${code}`, {Bot})

  }, [code]);

  const firstUpdate = useRef(true);
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?${param}=${btoa(code)}`;
    window.history.pushState({path:newUrl}, '', newUrl);
  }, [code]);

  return (
    <>
      <div className="card">
        <textarea value={code} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCode(e.target.value)} cols={80} rows={10}/>
        <div></div>
        <button onClick={() => {
          runBot();
        }}>Run</button>
      </div>
    </>
  )
}

export default App
