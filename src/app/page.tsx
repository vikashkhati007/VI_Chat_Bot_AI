"use client";
import { useState } from "react";
import Input from "./components/input";
import Button from "./components/button";
export default function Home() {
  const [data, setdata] = useState("");
  const [loading,setloading] = useState(false);
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
    setdata(response.response);
  }
 
  return (
    <>
      <div className="pagecontainer bg-[#353740] w-full h-screen flex justify-center items-center">
        <div className="chatcontainer w-[80%] h-[90%] overflow-hidden relative z-10 bg-black bg-opacity-50 rounded-lg">
          <div className="aioutputcontainer h-[90%] overflow-y-auto p-5">
          <h1>{data}</h1>
          </div>
          <form action={inputhandler}>
            <div className="inputcontainer absolute bottom-3 w-[100%] flex justify-between p-5">
              <div className="w-[70%]">
              <Input />
              </div>
              <div className="w-[20%]">
               {!loading?<Button src="/sendbutton/send.png" onCLick={(()=>{setloading(true)})}/>
               :<Button src="/sendbutton/loading.png"/>}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
