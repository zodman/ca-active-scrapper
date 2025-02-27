import Timeline from "react-calendar-timeline";
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
        <div className="grid">
          <h1>Pickleball KW</h1>
          <section className="grid">
            <small>
              <span class="is-pending">Green:</span> pending to open{" "}
            </small>
            <small>
              <span class="is-available">Blue:</span> ready to enroll
            </small>
            <small>
              <span class="is-full">Full:</span> is full
            </small>
          </section>
        </div>
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
      <small>
        generated at{" "}
        {process.env.BUILD_TIME ? process.env.BUILD_TIME : "develop"}
        code by <a href="https://t.me/zodman">@zodman</a>
      </small>
    </div>
  );
}
