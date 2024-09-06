// src/DragDropPanel.tsx
import React, { useState } from 'react';

interface Item {
  id: number;
  content: string;
}

const DragDropPanel: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, content: 'Item 1' },
    { id: 2, content: 'Item 2' },
    { id: 3, content: 'Item 3' },
  ]);
  const [droppedItems, setDroppedItems] = useState<Item[]>([]);

  // ... (keep the existing functions)

  return (
    <div className="flex flex-col md:flex-row border border-gray-300 m-4">
      <div className="w-full md:w-1/3 p-4 bg-gray-100">
        <h2 className="text-lg font-bold mb-2">Left Panel</h2>
        <button
          onClick={() =>
            setItems([
              ...items,
              { id: items.length + 1, content: `New Item ${items.length + 1}` },
            ])
          }
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Item
        </button>
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={(e) =>
                e.dataTransfer.setData('text/plain', item.id.toString())
              }
              className="mb-2 p-2 bg-white rounded shadow cursor-move"
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-full md:w-2/3 p-4 bg-gray-200 min-h-[200px]"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const id = parseInt(e.dataTransfer.getData('text/plain'), 10);
          const droppedItem = items.find((item) => item.id === id);
          if (droppedItem && !droppedItems.some((item) => item.id === id)) {
            setDroppedItems([...droppedItems, droppedItem]);
            setItems(items.filter((item) => item.id !== id));
          }
        }}
      >
        <h2 className="text-lg font-bold mb-2">Drop Items Here</h2>
        <div className="flex flex-wrap gap-2">
          {droppedItems.map((item) => (
            <div key={item.id} className="p-2 bg-white rounded shadow">
              {item.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragDropPanel;
