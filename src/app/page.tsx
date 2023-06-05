"use client";
import { useState } from "react";
import Input from "./components/input";
import Button from "./components/button";
import Conversation from "./components/conversation";
export default function Home() {
  const [data, setData] = useState([{
    userdata: "",
    aidata: ""
  }]);
  const [loading, setloading] = useState(false);
  async function inputhandler(formdata: FormData) {
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
    setData(prevData => ([
      ...prevData,                  // Spread operator to retain existing data
      {
        userdata: `${formdata.get("query")}`,
        aidata: response.response
      }
    ]));
  }

  return (
    <>
      <div className="pagecontainer bg-[#353740] w-full h-screen flex justify-center items-center">
        <div className="chatcontainer w-[80%] h-[90%] overflow-hidden relative z-10 bg-black bg-opacity-50 rounded-lg">
          <div className="aioutputcontainer h-[90%] overflow-y-auto p-5 overflow-x-hidden">
           {data.slice(1).map((d)=>{
            return(
              <>
            <Conversation key={d.aidata} aidata={d.aidata} userdata={d.userdata} />
            <hr className="w-[100%] my-5 opacity-10"/>
            </>
            )
          })}
          </div>
          <form action={inputhandler}>
            <div className="inputcontainer absolute bottom-1 w-[100%] flex justify-between p-5">
              <div className="w-[80%]">
                <Input />
              </div>
              <div className="w-[10%]">
                {!loading ? (
                  <Button
                    src="/sendbutton/send.png"
                    onCLick={() => {
                      setloading(true);
                    }}
                  />
                ) : (
                  <Button src="/sendbutton/loading.png" />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
