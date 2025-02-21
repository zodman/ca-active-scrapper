import Timeline from "react-calendar-timeline";
import "react-calendar-timeline/dist/style.css";
import moment from "moment";
import { useState } from "react";
import { Item } from "./Item";
import { groups, items } from "./utils";

export function App() {
  const [item, setItem] = useState(null);

  const onItemSelected = (itemId) => {
    const entry = items.find((e) => e.id === itemId);
    if (entry) {
      setItem(entry);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Pickleball KW</h1>
      </header>
      <section>
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={moment().add(-12, "hour")}
          defaultTimeEnd={moment().add(12, "hour")}
          canMove={false}
          canResize={false}
          onItemSelect={onItemSelected}
          minZoom={1000 * 60 * 60 * 24}
          selected={false}
        ></Timeline>
      </section>
      <section>
        <Item item={item} />
      </section>
    </div>
  );
}
