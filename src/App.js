import "./App.css";
import { useState, useRef } from "react";

function App() {
  const [items, setItems] = useState([]);

  function handleAddItems(item) {
    setItems(() => [...items, item]);
    console.log(items);
  }
  function handleDeleteItem(id) {
    console.log(id);

    setItems((items) => items.filter((item) => item.id !== id));
  }
  function handleDeleteAll() {
    const confirmation = window.confirm(
      "Are you sure you want to clear your list?"
    );
    if (confirmation) setItems([]);
  }

  function toggleItem(id) {
    setItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  }

  return (
    <div className="toDoList">
      <Logo />
      <Form addingItem={handleAddItems} />
      <List
        items={items}
        onDeleteItem={handleDeleteItem}
        deletAll={handleDeleteAll}
        ontoggleItems={toggleItem}
      />
      <Final items={items} />
    </div>
  );
}

function Logo() {
  return <h1>✏️2023 To-Do List 📝</h1>;
}

function Form({ addingItem }) {
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const dateInputRef = useRef(null);

  function handleDate(e) {
    setDate(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!description || !date) return;

    const newItem = {
      id: Date.now(),
      description,
      done: false,
      date,
    };
    console.log(newItem);
    addingItem(newItem);
    setDescription("");
    setDate("");
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>🗓️ What are your tasks to do this year? </h3>
      <input
        type="text"
        placeholder="Enter a task..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className="duedate">
        <label>Due Date: </label>
        <input
          type="date"
          value={date}
          onChange={handleDate}
          ref={dateInputRef}
        />
        {/* <DatePicker selected={date} onChange={(date) => setDate(date)} /> */}
      </div>
      <button>Add to List</button>
    </form>
  );
}

function List({ items, onDeleteItem, ontoggleItems, deletAll }) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;

  if (sortBy === "input") sortedItems = items;
  if (sortBy === "done")
    sortedItems = items.slice().sort((a, b) => Number(a.done) - Number(b.done));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItem={onDeleteItem}
            ontoggleItems={ontoggleItems}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="input">Sort By input order</option>
          <option value="done">Sort By completed tasks</option>
        </select>
        <button onClick={() => deletAll()}>Clear List</button>
      </div>
    </div>
  );
}

function Item({ item, onDeleteItem, ontoggleItems }) {
  return (
    <li>
      <input
        type="checkbox"
        value={item.done}
        onChange={() => ontoggleItems(item.id)}
      />
      <span style={item.done ? { textDecoration: "line-through" } : {}}>
        {item.description}
      </span>
      <span style={{ color: "rgb(51, 51, 51,.8)", marginLeft: "0" }}>
        {!item.done && `Deadline: ${item.date}`}
      </span>
      <button onClick={() => onDeleteItem(item.id)}>❌</button>
    </li>
  );
}

function Final({ items }) {
  const numTasks = items.length;
  const numDone = items.filter((item) => item.done).length;
  const percentage = numTasks > 0 ? (numDone / numTasks) * 100 : 0;
  return (
    <footer className="final">
      <em>
        {percentage === 100
          ? "You have completed all tasks in your list, WOA!💪🥇🎉"
          : `You have ${numTasks} tasks on your list, and you have completed ${numDone} of them!(${percentage.toFixed(
              2
            )}%)⏳`}
      </em>
    </footer>
  );
}

export default App;
