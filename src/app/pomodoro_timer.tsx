import React, { useState, useEffect } from 'react';
import { StateName,
         DefaultTimes,
         StateProps,
         StateButtonProps,
         TimerProps,
         ExtendTimerValueButtonProps,
         ControlProps,
         ControlButtonProps } from './interface';

function StateButton( { name, isSelected, text, onSelectionChange }: StateButtonProps) {
    const css1 = 'text-gray-300 bg-gray-700 hover:bg-gray-500 hover:text-gray-200';
    const css2 = 'text-gray-500 hover:bg-gray-700 hover:text-gray-300';

    const handleClick = () => {
        const stateString: string = name
        const stateName: StateName = stateString as StateName;
        onSelectionChange(stateName);
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

function Timer({ time, control, onSetTime }: TimerProps) {

    useEffect(() => {
        if(control === 'on') {
            const timer = setInterval(() => {
                onSetTime();
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [control, onSetTime]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        return hours > 0
            ?`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
            :`${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-9xl font-bold font-sans text-white">
        {/* Deve ser ajustado uma variável que atualiza o tempo */}
        <p>{formatTime(time)}</p>
        </div>
    );
}

function ProgressBar() {
    return (
        // Atualiza conforme passagem do timer
        <div className="bg-gray-600 rounded mt-10 w-80 h-1"></div>
    );
}

function ExtendTimerValue({onSetExtraTime}: {onSetExtraTime: (extraValue: number) => void}) {
    return (
        <div className="flex flex-row items-center justify-around w-80 mt-5 text-sm text-gray-500">
        {/* Implementar hover e acrescentar o valor do timer */}
        <ExtendTimerValueButton value={25} text={'+25 min'} onSetExtraTime={onSetExtraTime}/>
        <ExtendTimerValueButton value={10} text={'+10 min'} onSetExtraTime={onSetExtraTime}/>
        <ExtendTimerValueButton value={5} text={'+5 min'} onSetExtraTime={onSetExtraTime}/>
        <ExtendTimerValueButton value={1} text={'+1 min'} onSetExtraTime={onSetExtraTime}/>
        </div>
    );
}

function Control({ control, onSetControl }: ControlProps) {
    const verifyState = control === 'off';

    return (
        <div className="flex flex-row items-center justify-center w-80 mt-5 text-sm text-gray-200">
        {/* Implementar hover e acrescentar o valor do timer */}
        <ControlButton name={'on'} isSelected={verifyState} text={'Start'} onSetControlButton={onSetControl}/>
        <ControlButton name={'pause'} isSelected={!verifyState} text={'Pause'} onSetControlButton={onSetControl}/>
        <ControlButton name={'off'} isSelected={!verifyState} text={'Reset'} onSetControlButton={onSetControl}/>
        </div>
    );
}

function PomodoroTimer() {
    const [state, setState] = useState<string>('focus');
    const [time, setTime] = useState<number>(25 * 60);
    const [extraTime, setExtraTime] = useState<number>(0);
    const [control, setControl] = useState<string>('off')
    const defaultTimes: DefaultTimes = {
        focus: 25 * 60,
        short: 5 * 60,
        long: 15 * 60
    }

    const handleState = (nameState: StateName) => {
        setState(nameState);
        setTime(defaultTimes[nameState]);
        setControl('off')
    }

    const handleTimer = () => {
        setTime(prevTime => prevTime > 0 ? prevTime - 1 : 0);
    }

    const handleExtraTime = (extraValue: number) => {
        setExtraTime(extraValue)
        setTime(time + extraValue);
    }

    const handleControl = (nameControl: string) => {
        setControl(nameControl);
        if(nameControl === 'off') {
            const stateString: string = state
            const stateName: StateName = stateString as StateName;
            setTime(defaultTimes[stateName]);
        }
    }

    return (
        <>
        <State state={state} onSetState = {handleState}/>
        <Timer time={time} control={control} onSetTime = {handleTimer}/>
        <ProgressBar />
        <ExtendTimerValue onSetExtraTime = {handleExtraTime}/>
        <Control control={control} onSetControl={handleControl}/>
        </>
    );
}

export default PomodoroTimer;