import "./App.css";
import Form from "../components/pages/form/Form";
import List from "../components/pages/list/List";
import { useState } from "react";

type Page = "form" | "list";

function App() {
  const [page, setPage] = useState<Page>("form");
  return (
    <>
      <nav className="w-100 h-20 mx-auto flex items-center justify-center mb-10">
        <button
          onClick={() => setPage("form")}
          className="w-50 p-2 border border-zinc-300 hover:border-zinc-400 rounded-3xl mr-4 bg-indigo-50 hover:bg-indigo-100 "
        >
          Form
        </button>
        <button
          onClick={() => setPage("list")}
          className="w-50 p-2 border border-zinc-300 hover:border-zinc-400 rounded-3xl bg-indigo-50 hover:bg-indigo-100 "
        >
          List
        </button>
      </nav>

      {page === "form" ? <Form /> : <List />}
    </>
  );
}

export default App;
