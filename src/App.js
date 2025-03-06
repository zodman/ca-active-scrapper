import Timeline from "react-calendar-timeline";
import moment from "moment";
moment.suppressDeprecationWarnings = true;
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
              <span className="is-pending">Green:</span> pending to open{" "}
            </small>
            <small>
              <span className="is-available">Blue:</span> ready to enroll
            </small>
            <small>
              <span className="is-full">Full:</span> is full
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
          sidebarWidth={200}
          timeSteps={{
            minute: 1,
            hour: 1,
            day: 1,
            month: 1,
            year: 1,
          }}
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
