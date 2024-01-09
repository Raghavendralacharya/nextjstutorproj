import { useEffect, useState } from "react";
import Split from "react-split";
import ProblemDescription from "./ProblemDescription/ProblemDescription";
import Playground from "./Playground/Playground";
import Confetti from "react-confetti";
import useWindowSize from "../../hooks/useWindowSize";
import Axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Tabs, TabsHeader, TabsBody, Tab, TabPanel, } from "@material-tailwind/react";
let BackendBaseURL = process.env.BACK_END_URL || 'http://localhost:8000/';
console.log("BackendBaseURL", BackendBaseURL,  process.env)
import Head from 'next/head';

const pid = "two-sum" ;
let timeComp = true;

const Workspace = () => {
	const { width, height } = useWindowSize();
	const [success, setSuccess] = useState(false);
	const [solved, setSolved] = useState(false);
	const [submVideo, setSubmVideo] = useState(false);
	// const { problem, setProblem } =  useGetCurrentProblem(pid);

	const [problem, setProblem] = useState(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState("tab1");

	useEffect(() => {
		// Get problem from DB
		const getProblem = async () => {
			setLoading(true);

			let res = await Axios.get(BackendBaseURL+`getProblem`)
			// .then((res) => {
			console.log("res problem", res?.data?.problemList[0]);
			let resproblem = res?.data?.problemList[0] || {}
			setProblem({...resproblem });
				// easy, medium, hard
			setLoading(false);

			// }).catch((err)=>{
			// 	console.log("err", err);
			// })
		};
		getProblem();
	}, []);
	let blurCount = 0
	const notify = () => {
		console.log("window blur notify called");
		toast.warn("We noticed tab switching. Would result in autosubmission!");
		// // window.alert("leaving?");
		// if(blurCount == 2){

		// }
		blurCount++;
		
	}
	// let isBlurEventAttached = false;
	// if (!isBlurEventAttached) {
	// 	window.addEventListener("blur", () => {
	// 		console.log("timeComp",timeComp)
	// 		if(timeComp){
	// 			timeComp = false;
	// 			console.log("timeComp setting false",timeComp)
	// 			notify();
	// 			setTimeout(()=>{
	// 				timeComp = true;
	// 			},5000);
	// 		}
	// 	});
	// 	isBlurEventAttached = true;
	// }

	return (
		// <Tabs value="tab1" orientation="vertical" className='bg-dark-layer-2 relative overflow-x-hidden'>
        //     <TabsHeader>
        //         <Tab key="tab1" value="tab1" onClick={() => setActiveTab('tab1')} className={`font-small items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-3 py-2 pt-2 mt-1 cursor-pointer whitespace-nowrap ${activeTab === 'tab1' ? "text-white" : "text-gray-500"}`}>
        //             Q1
        //         </Tab>
                // {/* <Tab key="tab2" value="tab2" onClick={() => setActiveTab('tab2')} className={`font-small items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-3 py-2 pt-2 mt-1 cursor-pointer whitespace-nowrap ${activeTab === 'tab2' ? "text-white" : "text-gray-500"}`} >
                //     Q2
                // </Tab> */}
            // </TabsHeader>
            // <TabsBody className = "p-0">
            //     <TabPanel key="tab1" value="tab1" className = "p-0">
					<div>
						 <Head>
							{/* Add the Content-Security-Policy meta tag */}
							<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
						</Head>
						<Split className='split' minSize={0}>
							<div>
								<ProblemDescription problem={problem} _solved={solved} submVideo={submVideo}/>
								<ToastContainer />
							</div>
							<div className='bg-dark-fill-2'>
								<Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} setSubmVideo = {setSubmVideo} />
								{success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1} />}
							</div>
						</Split>
					</div>
                // </TabPanel>
				// {/* <TabPanel key="tab2" value="tab2" className = "p-0">
				// 	<div>
				// 	<Split className='split' minSize={0}>
				// 		<div>
				// 			<ProblemDescription problem={problem} _solved={solved} submVideo={submVideo}/>
				// 			<ToastContainer />
				// 		</div>
				// 		<div className='bg-dark-fill-2'>
				// 			<Playground problem={problem} setSuccess={setSuccess} setSolved={setSolved} setSubmVideo = {setSubmVideo} />
				// 			{success && <Confetti gravity={0.3} tweenDuration={4000} width={width - 1} height={height - 1} />}
				// 		</div>
				// 	</Split>
				// 	</div>
                // </TabPanel> */}
    //         </TabsBody>
    //     </Tabs>
	);
};
export default Workspace;


async function useGetCurrentProblem(problemId) {
	const [problem, setProblem] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get problem from DB
		const getProblem = async () => {
			setLoading(true);

			let res = await Axios.get(BackendBaseURL+`getProblem`)
			// .then((res) => {
			console.log("res problem", res?.data?.problemList[0]);
			let resproblem = res?.data?.problemList[0] || {}
			setProblem({...resproblem });
				// easy, medium, hard
			setLoading(false);

			// }).catch((err)=>{
			// 	console.log("err", err);
			// })
		};
		getProblem();
	}, [problemId]);

	return { problem, setProblem };
}