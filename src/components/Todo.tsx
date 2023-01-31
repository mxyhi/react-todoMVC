import { FC, useEffect, useRef, useState } from 'react';

export interface TodoType {
  id: string;
  todo: string;
  done: boolean;
}

export const Todo:FC = () => {
  const [todoList, setTodoList] = useState<TodoType[]>(
    JSON.parse(localStorage.getItem('todoList') || '[]')
  );
  const [isSelectedAll, setSelectedAll] = useState(false);
  const [isEditing, setEditing] = useState(false);
  const [active, setActive] = useState<0 | 1 | 2>(0);
  const changeActiveList = (status: 0 | 1 | 2) => {
    setActive(status);
    switch (status) {
      case 0:
        setTodoList(JSON.parse(localStorage.getItem('todoList') || '[]'));
        return;
      case 1:
        setTodoList(
          (
            JSON.parse(localStorage.getItem('todoList') || '[]') as TodoType[]
          ).filter(item => !item.done)
        );
        return;
      case 2:
        setTodoList(
          (
            JSON.parse(localStorage.getItem('todoList') || '[]') as TodoType[]
          ).filter(item => item.done)
        );
        return;
    }
  };
  useEffect(() => {
    setSelectedAll(todoList.length ? todoList.every(item => item.done) : false);
    if (active === 0) {
      localStorage.setItem('todoList', JSON.stringify(todoList));

      console.log(todoList);
    }
  }, [todoList]);
  const inputContent = useRef<HTMLInputElement>(null);

  return (
    <div className="flex justify-center items-center">
      <div>
        <div className="flex items-center justify-between">
          <input
            className="h-8 w-8 shadow-md"
            type="checkbox"
            checked={isSelectedAll}
            onChange={e => {
              setSelectedAll(e.target.checked);
              setTodoList(
                todoList.map(item => ({ ...item, done: e.target.checked }))
              );
            }}
          />
          <input
            onKeyUp={e => {
              if (e.code !== 'Enter') return;
              if (!inputContent.current?.value.length) return;
              setTodoList([
                {
                  id: Date.now().toString(),
                  todo: inputContent.current.value.trim(),
                  done: false,
                },
                ...todoList,
              ]);
              inputContent.current.value = '';
            }}
            ref={inputContent}
            className="mx-1 outline-black border-gray-400 border border-solid rounded h-8 w-2/3 px-2"
            type="text"
          />
          <button
            className="bg-blue-600 shadow-md rounded w-8 h-8 text-white hover:opacity-100 opacity-80"
            onClick={() => {
              if (!inputContent.current?.value.length) return;
              setTodoList([
                {
                  id: Date.now().toString(),
                  todo: inputContent.current.value.trim(),
                  done: false,
                },
                ...todoList,
              ]);
              inputContent.current.value = '';
            }}
          >
            +
          </button>
        </div>
        <div>
          {todoList.map((item, index) => (
            <div
              key={item.id}
              className="flex justify-between items-center mt-1 hover:bg-gray-100 "
            >
              <input
                type="checkbox"
                className="h-8 w-8 shadow-md"
                checked={item.done}
                onChange={e => {
                  setTodoList(it =>
                    it.map((item, i) =>
                      i === index ? { ...item, done: e.target.checked } : item
                    )
                  );
                }}
              />
              <div
                suppressContentEditableWarning
                contentEditable={isEditing}
                onDoubleClick={() => {
                  setEditing(true);
                }}
                onBlur={e => {
                  setTodoList(it =>
                    it.map((item, i) =>
                      i === index
                        ? { ...item, todo: e.target.innerText.trim() }
                        : item
                    )
                  );
                  setEditing(false);
                }}
                onKeyUp={e => {
                  if (e.code === 'Enter') {
                    const content = e.currentTarget.innerText.trim();

                    setTodoList(it =>
                      it.map((item, i) =>
                        i === index ? { ...item, todo: content } : item
                      )
                    );
                    setEditing(false);
                  }
                }}
                className="mx-1 text-left w-2/3"
              >
                {item.todo}
              </div>
              <button
                className="w-8 h-8 shadow-md bg-red-600 hover:opacity-100 opacity-80 text-white rounded"
                onClick={() => {
                  setTodoList(it =>
                    it.filter((_, i) => (i === index ? false : true))
                  );
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between items-center text-sm">
          <span className="mx-2">
            {(() => {
              const activeCount = todoList.filter(it => !it.done).length;
              return activeCount > 0 ? `${activeCount} item ` : `0 items `;
            })()}
            left
          </span>
          <div className="mx-5">
            <button
              className={`${
                active === 0 ? 'border' : ''
              } mx-1 border-solid rounded border-orange-200 px-2 py-1`}
              onClick={() => {
                changeActiveList(0);
              }}
            >
              All
            </button>
            <button
              onClick={() => {
                changeActiveList(1);
              }}
              className={`${
                active === 1 ? 'border' : ''
              } mx-1 border-solid rounded border-orange-200 px-2 py-1`}
            >
              Active
            </button>
            <button
              onClick={() => {
                changeActiveList(2);
              }}
              className={`${
                active === 2 ? 'border' : ''
              } mx-1 border-solid rounded border-orange-200 px-2 py-1`}
            >
              Completed
            </button>
          </div>
          <button
            className={`mx-2 ${
              todoList.some(it => it.done) ? '' : 'opacity-0'
            }`}
            onClick={() => {
              setTodoList(todoList.filter(it => !it.done));
            }}
          >
            Clear completed
          </button>
        </div>
      </div>
    </div>
  );
};

export default Todo;
