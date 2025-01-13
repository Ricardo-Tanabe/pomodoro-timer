import React, { JSX, useState, useRef, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IoMdCheckboxOutline } from 'react-icons/io';
import { MdKeyboardReturn, MdOutlineKeyboardBackspace } from 'react-icons/md';
import { CiPlay1 } from "react-icons/ci";
import { RiEditBoxLine } from "react-icons/ri";
import { FaRegTrashAlt } from "react-icons/fa";
import { TaskProps,
         ShowAddNewTasksProps,
         UserTaskInputProps,
         ShowTasksButtonProps } from './interface';

function Task ({taskName, taskKey, onClickEdit, onClickRemove}: TaskProps) {
    const iconSize = 20;

    function handleClick(event: React.MouseEvent<HTMLSpanElement>): number | null {
        const taskElement = event.currentTarget.closest('[data-key]');
        const taskKey = taskElement ? taskElement.getAttribute('data-key') : null
        if (taskKey){
            const taskKeyInt = parseInt(taskKey)
            return taskKeyInt;
        }
        return null;

    }

    function handleEditClick(event: React.MouseEvent<HTMLSpanElement>) {
        const taskKeyInt = handleClick(event);
        if(taskKeyInt !== null) {
            onClickEdit(taskKeyInt);
        }
    }

    function handleRemoveClick(event: React.MouseEvent<HTMLSpanElement>) {
        const taskKeyInt = handleClick(event);
        if(taskKeyInt !== null) {
            onClickRemove(taskKeyInt);
        }
    }

    return (
        <>
        <div data-key={taskKey} className='flex flex-row items-center cursor-pointer w-full py-1 px-2 text-gray-500 hover:bg-gray-700 group'>
            <span className='border-2 rounded-lg border-gray-500 p-2 mr-4 hover:border-gray-300' onClick={handleRemoveClick}></span>
            <span className='group-hover:text-gray-300'>{ taskName }</span>
            <div className='hidden flex-row ml-auto group-hover:flex'>
                <span className='mr-2'>
                    <CiPlay1 className='hover:text-gray-300' size={iconSize} />
                </span>
                <span className='mr-2' onClick={handleEditClick}>
                    <RiEditBoxLine className='hover:text-gray-300' size={iconSize} />
                </span>
                <span className='mr-2' onClick={handleRemoveClick}>
                    <FaRegTrashAlt className='hover:text-gray-300' size={iconSize - 2} />
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

function UserTaskInput( data: UserTaskInputProps ) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(inputRef.current) {
            inputRef.current.focus();
        }
        const haveTask: boolean = data.addTask
        function handleKeyPress (event: KeyboardEvent) {
            if(haveTask) {
                if(event.key === 'Enter') {
                    if(inputRef.current){
                        addInput();
                        inputRef.current.value = ''
                    }
                } else if(event.key === 'Escape') {
                    if(inputRef.current){
                        cancelInput();
                        inputRef.current.value = ''
                    }
                }
            }
        }
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [data]);

    function addInput() {
        if(inputRef.current) {
            const inputElement = inputRef.current;
            const parentElement = inputElement.parentElement
            if(parentElement && parentElement.parentNode) {
                const isLastChild = parentElement === parentElement.parentNode.lastElementChild;
                data.onClickAdd(inputElement.value, isLastChild);
                inputRef.current.value = '';
            }
        }
    }

    function cancelInput() {
        if(inputRef.current) {
            data.onClickCancel();
            inputRef.current.value = '';
        }
    }

    return (
        <div className={`flex flex-col items-center border-2 rounded-lg border-gray-600 p-2 w-full ${!data.addTask ? 'hidden' : ''}`}>
            <input type="text" ref={ inputRef }
                placeholder='Type and press enter to save or esc to cancel'
                className='caret-gray-200 bg-transparent text-gray-400 w-full px-2 placeholder:text-gray-600 focus:border-none focus:outline-none'/>
            <div className='flex flex-row items-center w-full'>
                <ShowTasksButton icon={MdKeyboardReturn} option={'Save'} onClick={addInput} />
                <ShowTasksButton icon={MdOutlineKeyboardBackspace} option={'Cancel'} onClick={cancelInput} />
            </div>
        </div>
    );
}

function ShowAddNewTasks({ content, addTask, setAddTask}: ShowAddNewTasksProps) {

    function changeText(addTaskActive: boolean, content: JSX.Element[]): JSX.Element {
        const validation = addTaskActive ? 'hidden' : ''
        if(content.length <= 0) {
            return (
                <>
                <IoMdCheckboxOutline className={`text-gray-800 m-2 ${validation}`} size={48} />
                <p className={`text-gray-700 text-sm ${validation}`}>No tasks for this day</p>
                <button className={`text-gray-500 underline text-sm hover:text-gray-300 ${validation}`}
                    onClick={() => setAddTask(true)}>Add a new task</button>
                </>
            );
        }
        return (
            <>
            <p className={`${validation} border-2 border-dotted border-gray-500 rounded-lg mt-2 w-full
                p-1 text-center text-gray-500 hover:border-gray-300 cursor-pointer hover:text-gray-300`}
                onClick={() => setAddTask(true)}>
                    + Add new task</p>
            </>
        );
    }

    return (
        <>
        { changeText(addTask, content) }
        </>
    );
}

function Tasks() {
    const [content, setContent] = useState<JSX.Element[]>([]);
    const [addTask, setAddTask] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<JSX.Element>(<></>);

    const addItem = (newTask: string) => {
        const newId = uuidv4();
        const newTaskContent = <Task
                key={newId}
                taskKey={content.length}
                taskName={newTask}
                onClickEdit={onClickEdit}
                onClickRemove={removeItem} />
        setContent((prevContent) => [...prevContent, newTaskContent]);
    }

    const editItem = (newTask: string) => {
        setAddTask(false);
        setEditContent(prevEditContent => {
            setContent((prevContent) => {
                const newContent = prevContent.map(item => {
                    if(item.type !== Task) {
                        const newElement = React.cloneElement(prevEditContent, { taskName: newTask, taskKey: prevEditContent.props.taskKey });
                        return newElement;
                    }
                    return item;
                })
                return newContent.map((item, newIndex) => (
                    React.cloneElement(item, {taskKey: newIndex})
                ));
            });
            return <></>;
        });
    }

    const removeItem = (index: number) => {
        setContent(prevContent => {
            const newContent = prevContent.filter((_, i) => i !== index)
            return newContent.map((item, newIndex) => (
                React.cloneElement(item, {taskKey: newIndex})
            ));
        });
    }

    function onClickCancel() {
        setAddTask(false);
        setEditContent(prevEditContent => {
            setContent(prevContent => {
                const newContent = prevContent.map((item, index) => {
                    if(item.type !== Task) {
                        const newElement = React.cloneElement(prevEditContent, { taskKey: index });
                        return newElement;
                    }
                    return item;
                })
                return newContent.map((item, newIndex) => 
                    React.cloneElement(item, { taskKey: newIndex })
                );
            });
            return <></>;
        });
    }

    function onClickEdit(index: number) {
        setAddTask(true);
        setContent((prevContent) => {
            const newContent = prevContent.map(item => {
                if(item.props.taskKey === index) {
                    const newId = uuidv4();
                    const newTaskContent = React.cloneElement(item, { taskKey: index });
                    setEditContent(newTaskContent);
                    return (
                        <UserTaskInput
                            key={newId}
                            addTask={addTask}
                            onClickAdd={onClickAdd}
                            onClickCancel={onClickCancel} />
                    );
                }
                return item;
            })
            return newContent;
        });
    }

    function onClickAdd(userInput: string, isLastChild: boolean) {
        const validInput = userInput.length > 0
        console.log(isLastChild)
        if(validInput) {
            if (isLastChild) {
                addItem(userInput);
            } else {
                editItem(userInput);
            }
        }
    }

    function contentOrder() {
        if(content.length > 0) {
            return (
                <>
                { content }
                <ShowAddNewTasks content={content} addTask={addTask} setAddTask={setAddTask}/>               
                {(!editContent.key)
                    ? <UserTaskInput addTask={addTask} onClickAdd={onClickAdd} onClickCancel={onClickCancel} />
                    : <></>
                }
                </>
            );
        } else {
            return (
                <>
                <ShowAddNewTasks content={content} addTask={addTask} setAddTask={setAddTask}/>
                <UserTaskInput addTask={addTask} onClickAdd={onClickAdd} onClickCancel={onClickCancel} />
                </>
            );}
    }

    return (
      <>
      <div className={`flex flex-col items-center p-3 ${addTask ? '' : 'h-full'} ${(content.length === 0) ? 'justify-center' : ''}`}>
        { contentOrder() }
      </div>
      </>
    );
  }

export default Tasks;
  