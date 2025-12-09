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
          className="w-50 p-2 border-2 rounded-xl mr-4  bg-neutral-50 hover:bg-neutral-200"
        >
          Form
        </button>
        <button
          onClick={() => setPage("list")}
          className="w-50 p-2  border-2 rounded-xl bg-neutral-50 hover:bg-neutral-200"
        >
          List
        </button>
      </nav>

      {page === "form" ? <Form /> : <List />}
    </>
  );
}

export default App;
