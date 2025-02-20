import { useEffect, useRef, useState } from "react";

export default function Camera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]); // Menyimpan foto
  const [isCapturing, setIsCapturing] = useState(false); // Status capture aktif
  const [timer, setTimer] = useState(3); // Timer countdown

  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error Accessing Camera:", error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const capture = async () => {
    if (isCapturing || images.length >= 4) return; // Cegah capture lebih dari 3

    setIsCapturing(true);
    setTimer(3);

    for (let i = 4; i > 0; i--) {
      setTimer(i);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Timer countdown
    }

    takePhoto();
  };

  const takePhoto = () => {
    if (images.length >= 4) return; 

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    setImages((prev) => {
      if (prev.length < 4) {
        const newImages = [...prev, canvas.toDataURL("image/png")];

        if (newImages.length === 4) {
          stopCamera(); 
        }

        return newImages;
      }
      return prev;
    });

    setIsCapturing(false);
  };

  const resetCapture = () => {
    setImages([]);
    startCamera(); // Restart kamera setelah reset
  };

  return (
    <div className="bg-black h-screen text-white flex flex-col items-center">
      {images.length < 4 && (
        <div className="p-10">
          <video className="rounded w-96" ref={videoRef} autoPlay />
          <button
            onClick={capture}
            className={`mt-4 px-4 py-2 rounded ${
              isCapturing ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500"
            } text-white`}
            disabled={isCapturing || images.length >= 4}
          >
            {isCapturing ? `Menunggu... (${timer})` : `Capture (${images.length + 1}/4)`}
          </button>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      {images.length === 4 && (
        <div className="grid gap-2 mt-4 border-yellow-500 border bg-gray-950 p-7 rounded-lg shadow-lg">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Captured ${index + 1}`}
              className="w-56 shadow-blue-200 border-3 border-dotted border-yellow-400 rounded-2xl"
            />
            
          ))}
          <span className="font-bold text-center text-xl mt-4">Bothw3b</span>
        </div>
      )}

      {images.length === 4 && (
        <button
          onClick={resetCapture}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Ulangi
        </button>
      )}
    </div>
  );
}
