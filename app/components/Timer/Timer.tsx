import React, { useEffect, useState } from "react";
import { FiRefreshCcw } from "react-icons/fi";

type TimerProps = {};

const Timer: React.FC<TimerProps> = () => {
	const [showTimer, setShowTimer] = useState<boolean>(false);
	const [time, setTime] = useState<number>(0);

	const formatTime = (time: number): string => {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = time % 60;

		return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}:${
			seconds < 10 ? "0" + seconds : seconds
		}`;
	};

	useEffect(() => {
		setShowTimer(true);
		let intervalId: NodeJS.Timeout;

		if (showTimer) {
			intervalId = setInterval(() => {
				setTime((time) => time + 1);
			}, 1000);
		}

		return () => clearInterval(intervalId);
	}, [showTimer]);

	return (
		<div>
			<div className='flex items-center space-x-2 bg-dark-fill-3 p-1.5 cursor-pointer rounded hover:bg-dark-fill-2'>
				<div className="text-white px-2">{formatTime(time)}</div>
				{/* <FiRefreshCcw
					onClick={() => {
						setShowTimer(false);
						setTime(0);
					}}
				/> */}
			</div>
		</div>
	);
};
export default Timer;
