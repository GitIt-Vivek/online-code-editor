import React from 'react'
import Navbar from '../components/Navbar'
import Editor2 from "@monaco-editor/react";
import { useState } from 'react';

const Editor = () => {
  const [code, setCode] = useState("")
  return (
    <>
      <Navbar />
      <div
        className="flex items-center justify-between "
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="left w-[50%] h-full">
          <Editor2
            theme="vs-dark"
            height="100%"
            width="100%"
            Language="python"
            value={code}
            onChange={(newCode) => setCode(newCode)}
          />
        </div>
        <div className="right text-white w-[50%] p-[10px] h-full bg-[#161625] ">
          <span className="  flex items-center pb-3 border-b-[1px] border-b-[#1f2435] ">
            Output
          </span>
          <button
            className="fixed bottom-0 mb-4 rounded-md px-4 py-1 bg-green-600 transition-all hover:bg-green-700"
            // Save when clicking the button
          >
            run
          </button>
          {/* <div className="p-4 bg-gray-100 rounded-lg shadow-md h-full overflow-y
          scroll"></div> */}
        </div>
      </div>
    </>
  );
}

export default Editor
