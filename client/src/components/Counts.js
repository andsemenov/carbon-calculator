import { useState } from "react";
const Counts = (props) => {
  const [counter, setCounter] = useState(0);
  const [people, setPeople] = useState([]);

  const removeItem = (id) => {
    let newPeople = people.filter((person) => person.id !== id);
    setPeople(newPeople);
  };

  console.log(people);
  return (
    <>
      {people.map((person) => {
        const { id, name } = person;
        return (
          <div key={id} className="item">
            <h4>{name}</h4>
            <button onClick={() => removeItem(id)}>X</button>
          </div>
        );
      })}
      <button
        className="btn"
        onClick={() => {
          setCounter((prevState) => {
            return prevState + 1;
          });
          setPeople([...people, { id: counter }]);
        }}
      >
        clear items
      </button>
    </>
  );
};

export default Counts;
