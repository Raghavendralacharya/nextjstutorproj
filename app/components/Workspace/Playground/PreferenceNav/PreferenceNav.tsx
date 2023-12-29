import { useState, useEffect } from "react";
import { AiOutlineFullscreen, AiOutlineFullscreenExit, AiOutlineSetting } from "react-icons/ai";
import { ISettings } from "../Playground";
// import SettingsModal from "@/components/Modals/SettingsModal";
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { Fragment } from 'react'
import Timer from "../../../Timer/Timer";

type PreferenceNavProps = {
	settings: ISettings;
	setSettings: React.Dispatch<React.SetStateAction<ISettings>>;
	selUserLang : string;
	setSelUserLang : React.Dispatch<React.SetStateAction<string>>;
};

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
  }

const PreferenceNav: React.FC<PreferenceNavProps> = ({ setSettings, settings , selUserLang, setSelUserLang}) => {
	const [isFullScreen, setIsFullScreen] = useState(false);
	const handleFullScreen = () => {
		if (isFullScreen) {
			document.exitFullscreen();
		} else {
			document.documentElement.requestFullscreen();
		}
		setIsFullScreen(!isFullScreen);
	};

	useEffect(() => {
		function exitHandler(e: any) {
			if (!document.fullscreenElement) {
				setIsFullScreen(false);
				return;
			}
			setIsFullScreen(true);
		}

		if (document.addEventListener) {
			document.addEventListener("fullscreenchange", exitHandler);
			document.addEventListener("webkitfullscreenchange", exitHandler);
			document.addEventListener("mozfullscreenchange", exitHandler);
			document.addEventListener("MSFullscreenChange", exitHandler);
		}
	}, [isFullScreen]);

	return (
		<div className='flex items-center justify-between bg-dark-layer-2 h-11 w-full '>
			<div className='flex items-center text-white'>
			<Menu as="div" className="relative inline-block text-left">
				<Menu.Button className='flex cursor-pointer items-center rounded focus:outline-none bg-dark-fill-3 text-dark-label-2 hover:bg-dark-fill-2  px-2 py-1.5 font-medium'>
					<div className='flex items-center px-1 w-24'>
						<div className='inline-flex text-xs text-label-2 dark:text-dark-label-2'>{selUserLang}
						<ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
						</div>
					</div>
				</Menu.Button>
				<Transition
					as={Fragment}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute right-0 z-10 mt-2 w-55 origin-top-right rounded-md bg-dark-layer-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-xs text-label-2 dark:text-dark-label-2 hover:bg-dark-fill-2">
					<div className="py-1">
						<Menu.Item>
						{({ active }) => (
							// <a
							// href="#"
							// className={classNames(
							// 	active ? 'bg-gray-100 text-gray-900' : 'text-white-700',
							// 	'block px-4 py-2 text-sm'
							// )}
							// >
							// javascript
							// </a>
							<button onClick={() => { setSelUserLang("javascript") }} className={classNames(
								active ? 'bg-gray-100 text-gray-900' : 'text-white-900',
								'block px-4 py-2 text-sm'
							)} >
							javascript
						</button>
						)}
						</Menu.Item>
						<Menu.Item>
						{({ active }) => (
							<button onClick={() => { setSelUserLang("cpp") }} className={classNames(
									active ? 'bg-gray-100 text-gray-900' : 'text-white-900',
									'block px-4 py-2 text-sm'
								)}>
								cpp
							</button>
						)}
						</Menu.Item>
						<Menu.Item>
						{({ active }) => (
							<button onClick={() => { setSelUserLang("java") }} className={classNames(
									active ? 'bg-gray-100 text-gray-900' : 'text-white-900',
									'block px-4 py-2 text-sm'
								)}>
								Java
							</button>
						)}
						</Menu.Item>
						<Menu.Item>
						{({ active }) => (
							<button onClick={() => { setSelUserLang("c") }} className={classNames(
									active ? 'bg-gray-100 text-gray-900' : 'text-white-900',
									'block px-4 py-2 text-sm'
								)}>
								C
							</button>
						)}
						</Menu.Item>
						<Menu.Item>
						{({ active }) => (
							<button onClick={() => { setSelUserLang("python") }} className={classNames(
									active ? 'bg-gray-100 text-gray-900' : 'text-white-900',
									'block px-4 py-2 text-sm'
								)}>
								Python
							</button>
						)}
						</Menu.Item>
					</div>
					</Menu.Items>
				</Transition>
			</Menu>
			</div>

			<div className='flex items-center m-2'>
				<Timer />
				<button
					className='preferenceBtn group'
					onClick={() => setSettings({ ...settings, settingsModalIsOpen: true })}
				>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						<AiOutlineSetting />
					</div>
					<div className='preferenceBtn-tooltip'>Settings</div>
				</button>

				<button className='preferenceBtn group' onClick={handleFullScreen}>
					<div className='h-4 w-4 text-dark-gray-6 font-bold text-lg'>
						{!isFullScreen ? <AiOutlineFullscreen /> : <AiOutlineFullscreenExit />}
					</div>
					<div className='preferenceBtn-tooltip'>Full Screen</div>
				</button>
			</div>
			{/* {settings.settingsModalIsOpen && <SettingsModal settings={settings} setSettings={setSettings} />} */}
		</div>
	);
};
export default PreferenceNav;
