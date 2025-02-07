import React, { useState, useEffect } from 'react';
import { TimeState,
         StateName,
         DefaultTimes,
         StateProps,
         StateButtonProps,
         TimerProps,
         ProgressBarProps,
         ExtendTimerValueButtonProps,
         ControlProps,
         CompletedSessionsProps,
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
        onSetExtraTime(value);
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
            <StateButton name={'focus'} text={'Focus'} aria-label="State focus"
                isSelected={state === 'focus'}
                onSelectionChange={onSetState}/>
            <StateButton name={'short'} text={'Short Break'} aria-label="State short break"
                isSelected={state === 'short'}
                onSelectionChange={onSetState}/>
            <StateButton name={'long'} text={'Long Break'} aria-label="State long break"
                isSelected={state === 'long'}
                onSelectionChange={onSetState}/>
        </div>
    );
}

function Timer({ time, extraTime, control, isPaused, onSetTime }: TimerProps) {

    useEffect(() => {
        if(control === 'on' || (control === 'pause' && !isPaused)) {
            const timer = setInterval(() => {
                onSetTime(extraTime);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [extraTime, isPaused, control, onSetTime]);

    const playAlarm = (seconds: number) => {
        if(seconds === 1) {
            const audio = new Audio('/doorbell-223669.mp3');
            audio.play();
        }
    }

    const formatTime = (seconds: number) => {
        const convertHours = 3600
        const convertMinutes = 60
        const hours = Math.floor(seconds / convertHours)
        const minutes = Math.floor((seconds % convertHours) / convertMinutes);
        const remainingSeconds = seconds % convertMinutes;
        playAlarm(seconds)
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
            <ExtendTimerValueButton value={25} text={'+25 min'} onSetExtraTime={onSetExtraTime} aria-label="Add 25 extra minutes"/>
            <ExtendTimerValueButton value={10} text={'+10 min'} onSetExtraTime={onSetExtraTime} aria-label="Add 10 extra minutes"/>
            <ExtendTimerValueButton value={5} text={'+5 min'} onSetExtraTime={onSetExtraTime} aria-label="Add 5 extra minutes"/>
            <ExtendTimerValueButton value={1} text={'+1 min'} onSetExtraTime={onSetExtraTime} aria-label="Add 1 extra minutes"/>
        </div>
    );
}

function Control({ control, isPaused, onSetControl }: ControlProps) {
    const verifyState = control === 'off';

    return (
        <div className="flex flex-row items-center justify-center w-80 mt-5 text-sm text-gray-200">
            <ControlButton name={'on'} isSelected={verifyState} aria-label="Start Timer"
                text={'Start'} onSetControlButton={onSetControl}/>
            <ControlButton name={'pause'} isSelected={!verifyState} aria-label="Pause or Resume Timer"
                text={isPaused ? 'Resume' : 'Pause'} onSetControlButton={onSetControl}/>
            <ControlButton name={'off'} isSelected={!verifyState} aria-label="Reset Timer"
                text={'Reset'} onSetControlButton={onSetControl}/>
        </div>
    );
}

function CompletedSessions({sessionsCount}: CompletedSessionsProps) {

    function sessionsNumber() {
        let msgDisplay = 'Nenhuma sessão realizada'
        if(sessionsCount > 0) {
            msgDisplay = sessionsCount > 1 ? `${sessionsCount} sessões realizadas` : `${sessionsCount} sessão realizada`
        }
        return (
            <div className='text-gray-600 mt-10'>
                { msgDisplay }
            </div>
        )
    }

    return (
        <>
        { sessionsNumber() }
        </>
    );
}

function PomodoroTimer() {
    const convertMinutes = 60;
    const defaultTimes: DefaultTimes = {
        focus: 25 * convertMinutes,
        short: 5 * convertMinutes,
        long: 15 * convertMinutes
    }
    const [state, setState] = useState<StateName>('focus');
    const [control, setControl] = useState<string>('off');
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [sessionsCount, setSessionsCount] = useState<number>(0);
    const [timeState, setTimeState] = useState<TimeState>({
        time: 25 * convertMinutes,
        timeBasedInState: 25 * convertMinutes,
        percent: 0,
        extraTime: 0,
    });

    const calculatePercent = (remainingTime: number, totalTime: number): number => {
        return Math.floor(100 - (remainingTime/(totalTime))*100);
    }

    const handleState = (nameState: StateName) => {
        setState(nameState);
        setTimeState({
            time: defaultTimes[nameState],
            timeBasedInState: defaultTimes[nameState],
            percent: 0,
            extraTime: 0
        })
        setControl('off');
        setIsPaused(false);
    }

    const handleTimer = (extraValue: number) => {
        setTimeState(prevState => {
            const subTime = prevState.time > 0 ? prevState.time - 1 : 0;
            const newTime = subTime + extraValue;
            const newTimeBased = prevState.timeBasedInState + extraValue;
            const newPercent = calculatePercent(newTime, newTimeBased);

            return {
                time: newTime,
                timeBasedInState: newTimeBased,
                percent: newPercent,
                extraTime: 0
            };
        });

        if(timeState.time === 1 && state === 'focus') {
            setSessionsCount(prevSessionCount => prevSessionCount + 1)
        }
    }

    const handleExtraTime = (value: number) => {
        setTimeState(prevState => ({
            ...prevState,
            extraTime: (value * convertMinutes),
        }));
        setControl('on');
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
        <Timer time={timeState.time} extraTime={timeState.extraTime}
            control={control} isPaused={isPaused} onSetTime = {handleTimer}/>
        <ProgressBar percent={timeState.percent}/>
        <ExtendTimerValue onSetExtraTime = {handleExtraTime}/>
        <Control control={control} isPaused={isPaused} onSetControl={handleControl}/>
        <CompletedSessions sessionsCount={sessionsCount}/>
        </>
    );
}

export default PomodoroTimer;

// Sound Effect by <a href="https://pixabay.com/pt/users/u_rbsjsi42wd-44883799/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=223669">u_rbsjsi42wd</a> from <a href="https://pixabay.com/sound-effects//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=223669">Pixabay</a>