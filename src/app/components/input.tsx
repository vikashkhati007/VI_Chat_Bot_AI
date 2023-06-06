const Input = ({ onChange, value, onKeyDown,id }: any) => {
  return (
    <div>
      <input
        autoComplete="off"
        id={id}
        onKeyDown={onKeyDown}
        onChange={onChange}
        value={value}
        placeholder="Enter Your Query?"
        className="w-full outline-none text-black rounded-lg h-10 text-lg p-3 shadow-sm shadow-red-50"
        type="text"
        name="query"
      />
    </div>
  );
};

export default Input;
