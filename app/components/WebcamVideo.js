import React, { useCallback, useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import Axios from 'axios';

export default function WebcamVideo({submVideo}) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  // console.log("webcamRef",webcamRef);
  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    // console.log("webcamRef 22 starting",webcamRef);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    console.log("stop capturing", mediaRecorderRef.current);
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, setCapturing]);

  // const handleDownload = useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.style = "display: none";
  //     a.href = url;
  //     a.download = "react-webcam-stream-capture.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);


  const uploadVideo = useCallback(() => {
    handleStopCaptureClick();
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const formData = new FormData();
      formData.append("file", blob);
      console.log("blobdata",blob);
      console.log("Request", formData);
      const url = 'http://localhost:8000/upload';

      // Send the POST request using Axios
      Axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Include proper headers for FormData
        },
      })
      .then((response) => {
        setRecordedChunks([]);
        console.log(response);
      })
      .catch((err) => {
        setRecordedChunks([]);
        console.log(err);
      });
    }
  }, [handleStopCaptureClick, recordedChunks]);

  const videoConstraints = {
    width: 420,
    height: 420,
    facingMode: "user",
  };

  // useEffect(() => {
  //    console.log("use effect called", submVideo);
  //   if(submVideo){
  //     handleStopCaptureClick();
  //   } 
  // });
  useEffect(()=>{
    console.log('something prop has changed.',submVideo)
    if(submVideo){
      uploadVideo();
    } 
},[uploadVideo, submVideo]);
  // (()=>{
  //   handleStartCaptureClick();
  // })();

  return (
    <div className="camcontainer border border-gray-100 shadow-sm">
      <Webcam
        height={150}
        width={150}
        audio={false}
        mirrored={true}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        onUserMedia={handleStartCaptureClick}
      />
      {/* {handleStartCaptureClick} */}
      {/* {capturing ? (
          {handleStartCaptureClick}
      ) : (
          {handleStartCaptureClick}
      )} */}
      {/* {submVideo && (
        {handleStopCaptureClick}
      )} */}
    </div>
  );
}