import React, { Dispatch, JSX, RefObject, SetStateAction } from 'react'
import { IconType } from 'react-icons';

export type StateName = 'focus' | 'short' | 'long';

export interface TimeState {
    time: number;
    timeBasedInState: number;
    percent: number;
    extraTime: number;
}

export interface StateProps {
    state: StateName;
    onSetState: (nameState: StateName) => void;
}

export interface StateButtonProps {
    name: string;
    text: string;
    isSelected: boolean;
    onSelectionChange: (nameState: StateName) => void;
}

export interface TimerProps {
    time: number;
    extraTime: number;
    control: string;
    isPaused: boolean;
    onSetTime: (extraTime: number) => void;
}

export interface ProgressBarProps {
    percent: number;
}

export interface ExtendTimerValueButtonProps {
    value: number;
    text: string;
    onSetExtraTime: (nameExtraTime: number) => void;
}

export interface ControlProps {
    control: string;
    isPaused: boolean;
    onSetControl: (nameControl: string) => void;
}

export interface CompletedSessionsProps {
    sessionsCount: number;
}

export interface ControlButtonProps {
    name: string;
    text: string;
    isSelected: boolean;
    onSetControlButton: (nameControl: string) => void;
}

export interface DefaultTimes {
    focus: number,
    short: number,
    long: number
}

export interface TaskProps {
    taskName: string,
    taskKey: number,
    onClickEdit: (index: number) => void,
    onClickRemove: (index: number) => void
}

export interface ShowAddNewTasksProps {
    content: JSX.Element[],
    addTask: boolean,
    setAddTask: Dispatch<SetStateAction<boolean>>;
}

export interface UserTaskInputProps {
    addTask: boolean
    onClickAdd: (inputRef: string, isLastChild: boolean) => void,
    onClickCancel: () => void,
}

export interface ShowTasksButtonProps {
    icon?: IconType;
    option: string;
    onClick?: () => void;
}