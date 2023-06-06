"use client";
import { useState } from "react";
import Input from "./components/input";
import Button from "./components/button";
import Conversation from "./components/conversation";
import React from "react";

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
  console.log(data.length);

  return (
    <>
      <div className="pagecontainer bg-[#353740] w-full h-screen flex justify-center items-center">
        <div className="chatcontainer w-[90%] h-[90%] overflow-hidden relative z-10 bg-black bg-opacity-50 rounded-lg overflow-y-scroll">
          {data.length < 2 ? (
            <>
              <div className="container mx-auto p-8 ">
                <h1 className="text-3xl font-bold mb-6">
                  VI Ai Bot: 24/7 Unlimited Free AI Assistance
                </h1>
                <div className="grid grid-cols-1 gap-6 opacity-80">
                  <div>
                    <h2 className="text-md font-semibold mb-2">
                      1. 24/7 Availability
                    </h2>
                    <p className="text-xs">
                      VI Ai Bot is available 24 hours a day, seven days a week,
                      ensuring continuous support and assistance whenever users
                      need it.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-md font-semibold mb-2">
                      2. Unlimited Usage
                    </h2>
                    <p className="text-xs">
                      VI Ai Bot offers unlimited usage, allowing users to
                      interact with the bot without any restrictions on the
                      number of queries or tasks they can perform.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-md font-semibold mb-2">
                      3. Seamless User Experience
                    </h2>
                    <p className="text-xs">
                      VI Ai Bot is designed to deliver a seamless user
                      experience, making it easy and intuitive for users to
                      interact with the bot.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-md font-semibold mb-2">
                      4. Diverse Range of Support
                    </h2>
                    <p className="text-xs">
                      VI Ai Bot is equipped with a vast knowledge base and can
                      provide assistance on various topics, including general
                      knowledge, problem-solving, recommendations, and more.
                    </p>
                  </div>

                  <div>
                    <h2 className="text-md font-semibold mb-2">
                      5. Natural Language Processing (NLP)
                    </h2>
                    <p className="text-xs">
                      VI Ai Bot utilizes advanced Natural Language Processing
                      (NLP) capabilities to understand and interpret user
                      queries and responses accurately.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
            <div className="aioutputcontainer h-[90%] px-8 py-5 overflow-y-scroll">
              {data.slice(1).map((d) => {
                return (
                  <>
                    <Conversation
                      key={d.aidata}
                      aidata={<pre className="pre-wrap">{d.aidata}</pre>}
                      userdata={<pre className="pre-wrap">{d.userdata}</pre>}
                    />
                    <hr className="w-[100%] my-5 opacity-10" />
                  </>
                );
              })}
            </div>
          </>
          )}
          <form action={inputHandler}>
            <div className="inputcontainer absolute -translate-y-5 w-[100%] flex justify-between px-8 py-3 gap-5 items-center">
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
