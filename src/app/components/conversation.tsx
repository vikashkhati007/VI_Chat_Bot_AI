const Conversation = ({aidata, userdata}:any) => {
  return (
    <div className="flex flex-col gap-3">
    <div className="flex gap-5">
    <h1> <span className="font-bold"> YOU : </span> {userdata}</h1>
    </div>
    <div className="flex gap-5">
    <h1> <span className="font-bold"> AI : </span> {aidata}</h1>
    </div>
    </div>
  )
}

export default Conversation
