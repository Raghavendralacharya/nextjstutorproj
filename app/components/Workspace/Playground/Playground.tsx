import { useState, useEffect } from "react";
import PreferenceNav from "./PreferenceNav/PreferenceNav";
import Split from "react-split";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import {python} from "@codemirror/lang-python"
import {java} from "@codemirror/lang-java"
import EditorFooter from "./EditorFooter";
import { Problem } from "../../../utils/types/problem";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth, firestore } from "@/firebase/firebase";
import { toast } from "react-toastify";
// import { useRouter } from "next/router";
// import { arrayUnion, doc, updateDoc } from "firebase/firestore";
// import useLocalStorage from "@/hooks/useLocalStorage";
import Axios from 'axios';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel,Input } from "@material-tailwind/react";
import { Link, useNavigate} from 'react-router-dom'

type PlaygroundProps = {
	problem: Problem;
	setSuccess: React.Dispatch<React.SetStateAction<boolean>>;
	setSolved: React.Dispatch<React.SetStateAction<boolean>>;
	setSubmVideo: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface ISettings {
	fontSize: string;
	settingsModalIsOpen: boolean;
	dropdownIsOpen: boolean;
}

const Playground: React.FC<PlaygroundProps> = ({ problem, setSuccess, setSolved, setSubmVideo}) => {
	const [activeTestCaseId, setActiveTestCaseId] = useState<number>(0);
	const [activeTab, setActiveTab] = useState("testcase");
	const [selUserLang, setSelUserLang] = useState("javascript")
	const [userLang, setUserLang] = useState(javascript());
	let [userCode, setUserCode] = useState<string>(problem?.langData[selUserLang]?.starterCode || "write function here");
	const [problemId, setProblemId] = useState("");
	// console.log("problem?.customExample?.funcInput",problem?.customExample)
	let funcInput = problem?.customExample?.funcInput.split("\n");
	const [customInput, setCustomInput] = useState<any[]>(funcInput || []);
	const [compileOutput, setCompileOutput] = useState("!! You must run your code !!");
	const [compileError, setCompileError] = useState("")
	const [loading, setLoading] = useState(false);
	// const [fontSize, setFontSize] = useLocalStorage("lcc-fontSize", "16px");
	// const navigate = useNavigate();
	
	const [settings, setSettings] = useState<ISettings>({
		fontSize: "16px",
		settingsModalIsOpen: false,
		dropdownIsOpen: false,
	});

	const [user] = [{email:"raghav@gmail.com"}]

	const pid = "two-sum"

	const languagesMap: { [key: string]: any } = {
		"c" : javascript(),
		"javascript" : javascript(),
		"python" : python(),
		"java" : java()
	}
	useEffect(() => {
		setUserLang(languagesMap[selUserLang] || javascript());
		// setUserCode(problem?.langData[selUserLang]?.starterCode || "write");
		// if(problem){
		localStorage.setItem(`code-${pid}`, JSON.stringify(problem?.langData[selUserLang]?.starterCode || "write here"));

		// }
	}, [selUserLang]);

	useEffect(() => {
		localStorage.setItem(`code-${pid}`, JSON.stringify(problem?.langData[selUserLang]?.starterCode || "write here"));
	}, [problem?.id]);

	useEffect(()=>{
		let	 funcInput = problem?.customExample?.funcInput.split("\n")
		setCustomInput( funcInput|| []);
	}, [problem?.id])

	const handleSubmit = (type: string) => {
		console.log("type", type)
		// toast.loading("submiting solution")
		setLoading(true)
		try {
			if(type === "Run"){
				compileWithCustomTestCase();
			} else {
				compileWithTestCase();
			}
		} catch (error: any) {
			console.log(error.message);
			if (
				error.message.startsWith("AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:")
			) {
				toast.error("Oops! One or more test cases failed", {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			} else {
				toast.error(error.message, {
					position: "top-center",
					autoClose: 3000,
					theme: "dark",
				});
			}
		}
	};

	function compileWithCustomTestCase() {
		userCode = userCode.slice(userCode.indexOf(problem?.langData[selUserLang]?.starterFunctionName));
		console.log("user code", userCode);
		// Post request to compile endpoint
		// call video upload api
		console.log(JSON.stringify(customInput))
		let input = customInput.reduce((prev, cur)=>{
			return (prev)? prev+"\n"+cur: cur;
		},"")
		console.log("input", input);
		setSubmVideo(true);
		Axios.post(`http://localhost:8000/api/compileWtihCustomTC`, {
			code: userCode,
			language: selUserLang,
			problem_id: "P1111",
			input : input,
			handlerCode: problem?.langData[selUserLang]?.handlerCode
		}).then((res) => {
			console.log("compileWithCustomTestCase  output", res.data)
			// setUserOutput(res.data.stdout);
			setCompileOutput(res.data.stdout);
			// if(status.id == 3){
				setCompileOutput(res.data.stdout);
				setCompileError(res.data.stderr|| res.data.compile_output);
			// } else {
			// 	setCompileError(res.data.stderr);
			// }
			setActiveTab('result');
			setSolved(true);
			setSuccess(true);
			setLoading(false)
			setTimeout(() => {
				setSuccess(false);
			}, 4000);
		})
	}

	function compileWithTestCase() {
		userCode = userCode.slice(userCode.indexOf(problem?.langData[selUserLang]?.starterFunctionName));
		console.log("user code", userCode);
		// Post request to compile endpoint
		// call video upload api
		let input = customInput
		console.log("input", input);
		setSubmVideo(true);
		Axios.post(`http://localhost:8000/api/compileWithTestCaseDummy`, {
			code: userCode,
			language: selUserLang,
			problem_id: "P1111",
			input : JSON.stringify(input),
			handlerCode: problem?.langData[selUserLang]?.handlerCode
		},{
			headers: {
			  'Authorization': `${localStorage.getItem("token")}`
			}
		  }).then((res) => {
			console.log("compileWithTestCaseDummy  output", res.data)
			// setUserOutput(res.data.stdout);
			setSolved(true);
			setSuccess(true);
			setLoading(false)
			// navigate("/Greetings");
			setTimeout(() => {
				setSuccess(false);
			}, 4000);

		})
	}
	
	useEffect(() => {
		const code = localStorage.getItem(`code-${pid}`);
		console.log("localstorage", code )
		if (user) {
			// setUserCode(code ? JSON.parse(code) : problem?.starterCode);
			setUserCode(code ? JSON.parse(code) : problem?.langData[selUserLang]?.starterCode || "write");
		} else {
			setUserCode(problem?.langData[selUserLang]?.starterCode || "write");
			// setUserCode(problem?.starterCode);
		}
	}, [pid, user, problem?.langData[selUserLang]?.starterCode]);

	const onChange = (value: string) => {
		setUserCode(value);
		localStorage.setItem(`code-${pid}`, JSON.stringify(value));
	};

	const handleInputChange = (index: number,value: string ) => {
		console.log(" customInput value", value)
		// try {
			customInput[index] = value
		// } catch{
		// 	customInput[index] = value;
		// }
		setCustomInput(customInput);
	};

	return (
		<div className='flex flex-col bg-dark-layer-1 relative overflow-x-hidden'>
			<PreferenceNav settings={settings} setSettings={setSettings} selUserLang={selUserLang} setSelUserLang={(setSelUserLang)}/>

			<Split className='h-[calc(100vh-94px)]' direction='vertical' sizes={[60, 40]} minSize={60}>
				<div className='w-full overflow-auto'>
					<CodeMirror
						value={userCode}
						theme={vscodeDark}
						onChange={onChange}
						extensions={[userLang]}
						style={{ fontSize: settings.fontSize }}
					/>
				</div>
				<div className='w-full px-5 overflow-auto'>
					<Tabs value={activeTab}>
						<TabsHeader className='flex h-10 items-center space-x-6'>
							<Tab key="testcase" value="testcase">
								<div className='relative flex h-full flex-col justify-center hover:bg-dark-fill-2 cursor-pointer rounded-lg px-2 py-1'>
									<div onClick={() => setActiveTab('testcase')} className={`text-sm font-medium leading-5 ${activeTab === 'testcase' ? "text-white" : "text-gray-500"}`}>Testcases</div>
									{/* <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' /> */}
								</div>
							</Tab>
							<Tab key="custtestcase" value="custtestcase">
								<div className='relative flex h-full flex-col justify-center hover:bg-dark-fill-2 cursor-pointer rounded-lg px-2 py-1'>
									<div onClick={() => setActiveTab('custtestcase')}  className={`text-sm font-medium leading-5 ${activeTab === 'custtestcase' ? "text-white" : "text-gray-500"}`} >Custom Testcases</div>
									{/* <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' /> */}
								</div>
							</Tab>
							<Tab key="result" value="result">
								<div className='relative flex h-full flex-col justify-center hover:bg-dark-fill-2 cursor-pointer rounded-lg px-2 py-1'>
									<div onClick={() => setActiveTab('result')}  className={`text-sm font-medium leading-5 ${activeTab === 'result' ? "text-white" : "text-gray-500"}`} >Result</div>
									{/* <hr className='absolute bottom-0 h-0.5 w-full rounded-full border-none bg-white' /> */}
								</div>
							</Tab>
						</TabsHeader>
						<TabsBody>
							<TabPanel key='testcase' value='testcase'>
							<div className='flex'>
								{problem?.examples.map((example, index) => (
									<div
										className='mr-2 items-start mt-2 '
										key={example.id}
										onClick={() => setActiveTestCaseId(index)}
									>
										<div className='flex flex-wrap items-center gap-y-4'>
											<div
												className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
												${activeTestCaseId === index ? "text-white" : "text-gray-500"}
											`}
											>
												Case {index + 1}
											</div>
										</div>
									</div>
								))}
							</div>
							<div className='font-semibold my-4'>
								<p className='text-sm font-medium mt-4 text-white'>Input:</p>
								<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
									{problem?.examples[activeTestCaseId].inputText}
								</div>
								<p className='text-sm font-medium mt-4 text-white'>Output:</p>
								<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
									{problem?.examples[activeTestCaseId].outputText}
								</div>
							</div> 
							</TabPanel>
							<TabPanel key='custtestcase' value='custtestcase'>
								{loading ? (
									<div className="text-center">
									<div role="status">
										<svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
											<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
										</svg>
										<span className="sr-only">Loading...</span>
									</div>
								</div>
								) : (
									<div className='font-semibold my-4'>
										<p className='text-sm font-medium mt-4 text-white'>Input:</p>
										<div className="flex">
											<div>
											{problem?.customExample?.input.map((input, index) => (
												<p key={"problemname"+index} className='text-sm font-medium mt-4 text-white px-3'>{input.name} :</p>
											))}
											</div>
											<div >
											{problem?.customExample?.input.map((input, index) => (
												<div key={"problemvalue"+index} className='w-full cursor-text rounded-lg border bg-dark-fill-3 border-transparent text-white mt-2'>
												<Input onChange={({ target }) => handleInputChange(index, target.value)} defaultValue={input.value} crossOrigin={undefined}/>
												</div>
											))}
											</div>
										</div>
									</div> 
								)}
									{/* <p className='text-sm font-medium mt-4 text-white'>Output:</p>
									<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
										{problem?.customExample?.outputText}
									</div> */}
								
							</TabPanel>
							<TabPanel key='result' value='result'>
								{/* <div className='font-semibold my-4'>
									<p className='text-sm text-centre font-medium mt-4 text-white'> !! You must run your code !!</p>
								</div>  */}
								<p className='text-sm font-medium mt-4 text-white'>Output:</p>
								<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
									{compileOutput}
								</div>
								<p className='text-sm font-medium mt-4 text-white'>Error:</p>
								<div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-dark-fill-3 border-transparent text-white mt-2'>
									{compileError}
								</div>
							</TabPanel>
						</TabsBody>
					</Tabs>
				</div>
			</Split>
			<EditorFooter handleSubmit={handleSubmit} />
		</div>
	);
};

export default Playground;
