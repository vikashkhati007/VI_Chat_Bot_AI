"use client";
import { useState } from "react";
import Input from "./components/input";
import Button from "./components/button";
import Conversation from "./components/conversation";

export default function Home() {
  const [data, setData] = useState([
    {
      userdata: "",
      aidata: "",
    },
  ]);
  const [loading, setloading] = useState(false);
  const [loading2, setloading2] = useState(false);
  const [userInput, setUserInput] = useState("");
  async function inputHandler(formdata: FormData) {
    const userquery = formdata.get("query");
    const url = `${process.env.NEXT_PUBLIC_HOST_URL}`;
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": `${process.env.NEXT_PUBLIC_APIKEY_URL}`,
        "X-RapidAPI-Host": `${process.env.NEXT_PUBLIC_APIHOST}`,
      },
      body: JSON.stringify({
        query: userquery,
      }),
    };
    const res = await fetch(url, options);
    const response = await res.json();
    setloading(false);
    setData((prevData) => [
      ...prevData, // Spread operator to retain existing data
      {
        userdata: `${formdata.get("query")}`,
        aidata: response.response,
      },
    ]);
    setUserInput("");
  }

  function keyPressFunction(e: any) {
    if (e.key === "Enter") {
      setloading(true);
    }
  }
  function enterPressFunction() {
    setloading(true);
  }

  function handleSpeechRecognition(e: any) {
    setloading2(true);
    e.preventDefault();
    var speech = true;
    window.SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;

    recognition.addEventListener("result", (e) => {
      const transcript = Array.from(e.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");

      setUserInput(transcript);
    });

    recognition.addEventListener("end", () => {
      setloading2(false);
    });

    if (speech) {
      recognition.start();
    }
  }

  return (
    <>
      <div className="pagecontainer bg-[#353740] w-full h-screen flex justify-center items-center">
        <div className="chatcontainer w-[90%] h-[90%] overflow-hidden relative z-10 bg-black bg-opacity-50 rounded-lg">
          <div className="aioutputcontainer h-[90%] overflow-y-auto p-5 overflow-x-hidden">
            {data.slice(1).map((d) => {
              return (
                <>
                    <Conversation key={d.aidata} aidata={d.aidata} userdata={d.userdata} />
                    <hr className="w-[100%] my-5 opacity-10" />
                </>
              );
            })}
          </div>
          <form action={inputHandler}>
            <div className="inputcontainer absolute -translate-y-5 w-[100%] flex justify-between p-5 gap-5 items-center">
              <div className="w-[80%]">
                <Input
                  id="convert_text"
                  onKeyDown={keyPressFunction}
                  onChange={(e: any) => {
                    setUserInput(e.target.value);
                  }}
                  value={userInput}
                />
              </div>
              <div className="w-[2.7rem] flex flex-1 gap-4 items-center">
                {!loading2 ? (
                  <Button
                    src="/voice/voice.png"
                    onClick={handleSpeechRecognition}
                    id="click_to_record"
                  />
                ) : (
                  <Button src="/voice/stop.png" />
                )}
                {!loading ? (
                  <Button
                    id="myButton"
                    className={"button"}
                    src="/sendbutton/send.png"
                    onClick={enterPressFunction}
                  />
                ) : (
                  <Button src="/sendbutton/loading.png" className={"button"} />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
