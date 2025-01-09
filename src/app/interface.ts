export type StateName = 'focus' | 'short' | 'long';

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
    control: string;
    isPaused: boolean;
    onSetTime: () => void;
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