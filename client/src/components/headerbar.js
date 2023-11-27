export default function HeaderBar(props) {
  return (
    <div id="nav" className="flex flex-row border-b-2 py-2">
      <h3 className="basis-1/6 mx-3 text-2xl">
        <img className="w-13 h-8 object-contain" src="../logo-stackoverflow.png" alt="fake-stackoverflow-icon"/>
      </h3>
      <input
        id="search"
        placeholder="Search..."
        className="basis-3/6 border-2 rounded border-slate-400 pl-2 outline-none"
        value={props.searchValue}
        onChange={props.search}
        onKeyDown={props.search} // search on enter
      />
      <div className="flex flex-grow basis-2/6 justify-center items-center">
        <button id="newest-btn" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-2" onClick={props.handleSort}>
          Newest
        </button>
        <button id="answered-btn" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-2" onClick={props.handleSort}>
          Active
        </button>
        <button id="unanswered-btn" className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-1 border-blue-700 hover:border-blue-500 rounded mx-2" onClick={props.handleSort}>
          Unanswered
        </button>
      </div>
    </div>
  );
}
