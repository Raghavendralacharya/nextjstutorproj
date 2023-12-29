"use client"
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Workspace  from '../components/Workspace/Workspace'

export default function Problem() {
    const [userTheme, setUserTheme] = useState("vs-dark");
	const [fontSize, setFontSize] = useState(20);
    const [userLang, setUserLang] = useState("python");

    return (
		<div>
			{/* <Navbar
				fontSize={fontSize} setFontSize={setFontSize}
				userTheme={userTheme} setUserTheme={setUserTheme}	
				userLang={userLang} setUserLang={setUserLang}
			/> */}
			<Workspace problem={"1234"} />
		</div>
	);
}

