import React, { memo, useMemo } from "react";
import { useState } from "react";

function ItemList({ items }: { items: string[] }) {
  console.log("ItemList rendered");
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const MemoizedItemList = memo(ItemList);

function Parent() {
  // memo 하지 않으면 새로운 배열이 매 렌더마다 새로 생성됨 => memo() 의미 없어지고 child 리렌더링 발생
  const items = useMemo(() => ["apple", "banana", "orange"], []);
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>Click</button>
      <MemoizedItemList items={items} />
    </>
  );
}

export default Parent;
