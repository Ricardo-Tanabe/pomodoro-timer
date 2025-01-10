import React, { JSX, useState, useRef, useEffect } from 'react'
import { IoMdCheckboxOutline } from 'react-icons/io';
import { MdKeyboardReturn, MdOutlineKeyboardBackspace } from 'react-icons/md';
import { CiPlay1 } from "react-icons/ci";
import { RiEditBoxLine } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { ShowTasksProps, ShowTasksButtonProps } from './interface';

function Task ({taskName}: {taskName: string}) {
    const iconSize = 20;
    return (
        <>
        <div className='flex flex-row items-center w-full py-1 px-2 text-gray-300 hover:bg-gray-700 group'>
            <span className='border-2 rounded-lg border-gray-400 p-2 mr-4'></span>
            <span>{ taskName}</span>
            <div className='hidden flex-row ml-auto group-hover:flex'>
                <span className='mr-2'>
                    <CiPlay1 size={iconSize} />
                </span>
                <span className='mr-2'>
                    <RiEditBoxLine size={iconSize} />
                </span>
                <span className='mr-2'>
                    <FaRegTrashAlt size={iconSize - 2} />
                </span>
            </div>
        </div>
        </>
    );
}

function ShowTasksButton ({icon: Icon, option, onClick}: ShowTasksButtonProps) {
    const buttonCSS = 'flex items-center text-gray-500 mr-2 hover:text-gray-200 group';
    const iconCSS = 'rounded-lg border-none bg-gray-600 w-10 text-gray-800 m-2 group-hover:text-gray-200 group-hover:bg-gray-500';
    const iconSize = 24;

    return (
        <>
        <button className={ buttonCSS } onClick={onClick}>
            {Icon && <Icon className={ iconCSS } size={iconSize} />}
            <span>{ option }</span>
        </button>
        </>
    );
}

function AddedTasks(addTask: boolean) {
    const inputRef = useRef<HTMLInputElement>(null);

    function onClickCancel() {
        // setContent(initialContent);
        // setAddTask(false);
    }

    function onClickAdd() {
        if(inputRef.current) {
            // addItem(inputRef.current.value);
            // setAddTask(false);
            // const newTask: JSX.Element[] = taskList.map((item, index) => <Task key={index} taskName={item} />);
            // setContent(newTask);
        }
    }

    return (
        <div className={`flex flex-col items-center border-2 rounded-lg border-gray-600 p-2 w-full ${!addTask ? 'hidden' : ''}`}>
            <input type="text" ref={ inputRef }
                placeholder='Type and press enter to sace or esc to cancel'
                className='caret-gray-200 bg-transparent text-gray-400 w-full px-2 placeholder:text-gray-600 focus:border-none focus:outline-none'/>
            <div className='flex flex-row items-center w-full'>
                <ShowTasksButton icon={MdKeyboardReturn} option={'Save'} onClick={onClickAdd} />
                <ShowTasksButton icon={MdOutlineKeyboardBackspace} option={'Cancel'} onClick={onClickCancel} />
            </div>
        </div>
    );
}

function NoTasks({ items, addTask, setAddTask}: ShowTasksProps) {

    function shouldHidden(addTaskActive: boolean, items: string[]): string {
        return (addTask || items.length > 0) ? 'hidden' : '';
    }

    function onClickAddTask() {
        setAddTask(true);
    }

    return (
        <>
        <IoMdCheckboxOutline className={`text-gray-800 m-2 ${shouldHidden(addTask, items)}`} size={48} />
        <p className={`text-gray-700 text-s ${shouldHidden(addTask, items)}`}>No tasks for this day</p>
        <button className={`text-gray-500 underline text-sm hover:text-gray-300 ${shouldHidden(addTask, items)}`} onClick={onClickAddTask}>Add a new task</button>
        </>
    );
}

function Tasks() {
    const [taskList, setTaskList] = useState<string[]>([]);
    const [content, setContent] = useState<JSX.Element[]>([]);
    const [addTask, setAddTask] = useState<boolean>(false);

    const addItem = (newTask: string) => {
        setTaskList((prevTaskList) => [...prevTaskList, newTask]);
    }

    const removeItem = (index: number) => {
        setTaskList(prevTask => prevTask.filter((_, i) => i !== index));
    }

    return (
      <>
      <div className={`flex flex-col items-center h-full p-3 ${(taskList.length === 0) ? 'justify-center' : ''}`}>
        <NoTasks items={taskList} addTask={addTask} setAddTask={setAddTask}/>
        { content }
        {/* <AddedTasks addTask={addTask} /> */}
      </div>
      </>
    );
  }

export default Tasks;
  