import { useState, useEffect } from 'react';
import './compiler.css';
import Editor from "@monaco-editor/react";
import Navbar from '../Navbar';
import Axios from 'axios';
import spinner from '../../spinner.svg';
import WebcamVideo from "../../pages/WebcamVideo";
import Draggable from 'react-draggable';
import {
	MediaPermissionsError,
	MediaPermissionsErrorType,
	requestMediaPermissions
  } from 'mic-check';
let BackendBaseURL = process.env.BACK_END_URL || 'http://localhost:8000/';

const Compiler = ()=>{
    // / State variable to set users source code
	const [userCode, setUserCode] = useState(``);

	// State variable to set editors default language
	const [userLang, setUserLang] = useState("python");

	// State variable to set editors default theme
	const [userTheme, setUserTheme] = useState("vs-dark");

	// State variable to set editors default font size
	const [fontSize, setFontSize] = useState(20);

	// State variable to set users input
	const [userInput, setUserInput] = useState("");

	const [problemId, setProblemId] = useState("");

	// State variable to set users output
	const [userOutput, setUserOutput] = useState("");

	// Loading state variable to show spinner
	// while fetching data
	const [loading, setLoading] = useState(false);

	const [html, setHTML] = useState({__html: ""});

	const options = {
		fontSize: fontSize
	}

	// Function to call the compile endpoint
	function compile() {
		setLoading(true);
		if (userCode === ``) {
			return
		}
		console.log("calling compile api");
		// Post request to compile endpoint
		Axios.post(BackendBaseURL +`compile`, {
			code: userCode,
			language: userLang,
			input: userInput
		}).then((res) => {
			console.log("data  output", res.data)
			setUserOutput(res.data.stdout);
		}).then(() => {
			console.log("data  output2")
			setLoading(false);
		})
	}

	function compileWithTestCase() {
		setLoading(true);
		if (userCode === ``) {
			return
		}
		console.log("calling compile api");
		// Post request to compile endpoint
		Axios.post(BackendBaseURL+`compileWithTestCase`, {
			code: userCode,
			language: userLang,
			problem_id: problemId
		}).then((res) => {
			console.log("data  output", res.data)
			setUserOutput(res.data.stdout);
		}).then(() => {
			console.log("data  output2")
			setLoading(false);
		})
	}

	useEffect(() => {
        async function createMarkup() {
        	let response;
        	response = await Axios.post(BackendBaseURL+`startTest`, {userId: "123"})
		  	console.log("start test response", response)
        	const backendHtmlString = await response.data.problemList[0].problem_desc;
    
           console.log(backendHtmlString)
            return {__html: backendHtmlString};
         }
         createMarkup().then(result => setHTML(result));
      }, []);
	// Function to clear the output screen
	function clearOutput() {
		setUserOutput("");
	}

	// const dispatch = useDispatch();
	// //clear errors on page mounted
	// useEffect(() => {
	// 	dispatch(removeError());
	// }, [dispatch]);

	// requestMediaPermissions()
	// .then(() => {
	// 	console.log("can successfully access camera and microphone streams")
	// 	// can successfully access camera and microphone streams
	// 	// DO SOMETHING HERE
	// })
	// .catch((err) => {
	// 	console.log("Error occured.")
	// 	const { type, name, message } = err;
	// 	if (type === MediaPermissionsErrorType.SystemPermissionDenied) {
	// 		// browser does not have permission to access camera or microphone
	// 	} else if (type === MediaPermissionsErrorType.UserPermissionDenied) {
	// 		// user didn't allow app to access camera or microphone
	// 	} else if (type === MediaPermissionsErrorType.CouldNotStartVideoSource) {
	// 		// camera is in use by another application (Zoom, Skype) or browser tab (Google Meet, Messenger Video)
	// 		// (mostly Windows specific problem)
	// 	} else {
	// 		// not all error types are handled by this library
	// 	}
	// });

	function Problem() {
		return <div dangerouslySetInnerHTML={html} />;
	  }
	  

	return (
		<div className="Compiler">
			<Navbar
				fontSize={fontSize} setFontSize={setFontSize}
				userTheme={userTheme} setUserTheme={setUserTheme}	
				userLang={userLang} setUserLang={setUserLang}
			/>
			<div className="main">
				<div className="left-container" id="left-div">
					<div className = "overflow-auto" ><Problem/>
					</div>
					<div className="output-box">
						<h4>Input:</h4>
						<textarea id="code-inp" onChange=
							{(e) => setUserInput(e.target.value)}>
						</textarea>
					</div>
				</div>
				<div className="right-container" id="right-div">
					<Editor
						options={options}
						height="100vh"
						width="100%"
						theme={userTheme}
						language={userLang}
						defaultLanguage="python"
						defaultValue="// Enter your code here"
						onChange={(value) => { setUserCode(value) }}
					/>
					<div className="output-box">
						<h4>Output:</h4>
						<pre>{userOutput}</pre>
						<button onClick={() => { clearOutput() }}
							className="clear-btn">
							Clear
						</button>
						<button className="run-btn" onClick={() => compile()}>
								Run
						</button>
						<button className="subm-btn" onClick={() => compileWithTestCase()}>
							submit 
						</button>
						<div id="cam-div"><WebcamVideo /></div>
					</div>
				</div>
				{/* <dir>	
					<Draggable>
						<div id="cam-div"><WebcamVideo /></div>
					</Draggable>
				</dir> */}
			</div>
		</div>
	);
}


export default Compiler