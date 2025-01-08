'use client'

import React, { useState } from 'react';
import PomodoroTimer from './pomodoro_timer'

function Tasks() {
  return (
    <></>
  );
}

export default function Page() {
  return (
    <div className="grid grid-rows-[auto_1fr] h-screen bg-black w-screen xl:grid-cols-[auto_1fr] xl:grid-rows-none">
      <div className="order-2 bg-gray-900 rounded-lg m-3 mt-0 xl:order-1 xl:mt-3 xl:w-144">
        <Tasks />
      </div>
      <div className="place-items-center place-content-center order-1 bg-gray-900 rounded-lg m-3 h-144 xl:order-2 xl:ml-0 xl:h-auto">
        <PomodoroTimer />
      </div>
    </div>
  );
}