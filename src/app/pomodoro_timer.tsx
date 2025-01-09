import React, { useState, useEffect } from 'react';
import { StateName,
         DefaultTimes,
         StateProps,
         StateButtonProps,
         TimerProps,
         ProgressBarProps,
         ExtendTimerValueButtonProps,
         ControlProps,
         ControlButtonProps } from './interface';

function StateButton( { name, isSelected, text, onSelectionChange }: StateButtonProps) {
    const css1 = 'text-gray-300 bg-gray-700 hover:bg-gray-500 hover:text-gray-200';
    const css2 = 'text-gray-500 hover:bg-gray-700 hover:text-gray-300';

    const handleClick = () => {
        onSelectionChange(name as StateName);
    }

    return (
        <>
        <button className={`rounded-lg p-2 mx-2 ${isSelected ? css1 : css2}`}
            onClick={handleClick} value={ name }>
            { text }
        </button>
        </>
    );
}

function ExtendTimerValueButton({ value, text, onSetExtraTime }: ExtendTimerValueButtonProps) {
    
    const handleClick = () => {
        onSetExtraTime(value * 60);
    }


    return (
        <>
        <button className='hover:text-gray-400' value={ value } onClick={handleClick}>
            { text }
        </button>
        </>
    );
}

function ControlButton({name, text, isSelected, onSetControlButton}: ControlButtonProps) {
    const css = "bg-gray-700 rounded-lg p-2 mx-2 hover:bg-gray-500 hover:text-gray-100";

    const handleClick = () => {
        onSetControlButton(name);
    }

    return (
        <>
        <button
            className={`${css} ${isSelected ? '' : 'hidden'}`}
            onClick={handleClick}>
            { text }
        </button>
        </>
    );
}

function State({state, onSetState}: StateProps) {

    return (
        <div className="flex flex-row items-center justify-between w-80 mb-9 text-white">
            <StateButton name={'focus'} text={'Focus'}
                isSelected={state === 'focus'}
                onSelectionChange={onSetState}/>
            <StateButton name={'short'} text={'Short Break'}
                isSelected={state === 'short'}
                onSelectionChange={onSetState}/>
            <StateButton name={'long'} text={'Long Break'}
                isSelected={state === 'long'}
                onSelectionChange={onSetState}/>
        </div>
    );
}

function Timer({ time, control, isPaused, onSetTime }: TimerProps) {

    useEffect(() => {
        if(control === 'on' || (control === 'pause' && !isPaused)) {
            const timer = setInterval(() => {
                onSetTime();
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isPaused, control, onSetTime]);

    const formatTime = (seconds: number) => {
        const convertHours = 3600
        const convertMinutes = 60
        const hours = Math.floor(seconds / convertHours)
        const minutes = Math.floor((seconds % convertHours) / convertMinutes);
        const remainingSeconds = seconds % convertMinutes;
        return hours > 0
            ?`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
            :`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-9xl font-bold font-sans text-white">
            <p>{formatTime(time)}</p>
        </div>
    );
}

function ProgressBar({ percent }: ProgressBarProps) {
    return (
        <div className="bg-gray-600 rounded mt-10 p-0 w-80 h-1">
            <div className="bg-gray-400 rounded p-0 h-1" style={{width: `${percent}%`}}></div>
        </div>
    );
}

function ExtendTimerValue({onSetExtraTime}: {onSetExtraTime: (extraValue: number) => void}) {
    return (
        <div className="flex flex-row items-center justify-around w-80 mt-5 text-sm text-gray-500">
            <ExtendTimerValueButton value={25} text={'+25 min'} onSetExtraTime={onSetExtraTime}/>
            <ExtendTimerValueButton value={10} text={'+10 min'} onSetExtraTime={onSetExtraTime}/>
            <ExtendTimerValueButton value={5} text={'+5 min'} onSetExtraTime={onSetExtraTime}/>
            <ExtendTimerValueButton value={1} text={'+1 min'} onSetExtraTime={onSetExtraTime}/>
        </div>
    );
}

function Control({ control, isPaused, onSetControl }: ControlProps) {
    const verifyState = control === 'off';

    return (
        <div className="flex flex-row items-center justify-center w-80 mt-5 text-sm text-gray-200">
            <ControlButton name={'on'} isSelected={verifyState}
                text={'Start'} onSetControlButton={onSetControl}/>
            <ControlButton name={'pause'} isSelected={!verifyState}
                text={isPaused ? 'Resume' : 'Pause'} onSetControlButton={onSetControl}/>
            <ControlButton name={'off'} isSelected={!verifyState}
                text={'Reset'} onSetControlButton={onSetControl}/>
        </div>
    );
}

function PomodoroTimer() {
    const convertMinutes = 60;
    const [state, setState] = useState<StateName>('focus');
    const [time, setTime] = useState<number>(25 * convertMinutes);
    const [timeBasedInState, setTimeBasedInState] = useState<number>(25);
    const [percent, setPercent] = useState<number>(0);
    const [control, setControl] = useState<string>('off');
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const defaultTimes: DefaultTimes = {
        focus: 25 * convertMinutes,
        short: 5 * convertMinutes,
        long: 15 * convertMinutes
    }

    const handleState = (nameState: StateName) => {
        setState(nameState);
        setTime(defaultTimes[nameState]);
        setTimeBasedInState(defaultTimes[nameState]);
        setPercent(0);
        setControl('off');
        setIsPaused(false);
    }

    const handleTimer = () => {
        setTime(prevTime => {
            const newTime = prevTime > 0 ? prevTime - 1 : 0;
            setPercent(Math.floor(100 - (newTime/timeBasedInState)*100));
            return newTime;
        });
        
    }

    const handleExtraTime = (extraValue: number) => {
        setTime(prevTime => {
            const newTime = prevTime + extraValue;
            setPercent(Math.floor(100 - (newTime/(timeBasedInState))*100));
            return newTime;
        });
        setTimeBasedInState(prevTimeBased => prevTimeBased + extraValue);
    }

    const handleControl = (nameControl: string) => {
        setControl(nameControl);
        if(nameControl === 'off') {
            handleState(state)
        } else if (nameControl === 'pause') {
            setIsPaused(prevState => !prevState)
        }
    }

    return (
        <>
        <State state={state} onSetState = {handleState}/>
        <Timer time={time} control={control} isPaused={isPaused} onSetTime = {handleTimer}/>
        <ProgressBar percent={percent}/>
        <ExtendTimerValue onSetExtraTime = {handleExtraTime}/>
        <Control control={control} isPaused={isPaused} onSetControl={handleControl}/>
        </>
    );
}

export default PomodoroTimer;