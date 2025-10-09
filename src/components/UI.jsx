import React, { useState } from "react"; // Import useState for state management

const UI = ({ isMuted, setIsMuted }) => {
  // Hapus: const [isMuted, setIsMuted] = useState(false);

  // Fungsi untuk menangani button click
  const toggleMute = () => {
    setIsMuted(!isMuted); // Panggil setter dari prop // Log sekarang akan menampilkan status *sebelum* toggle.
    console.log(`Microphone is now: ${!isMuted ? "Muted" : "Unmuted"}`);
  };

  return (
    <>
      {/* SEMUA CSS DITARUH DI SINI */}
      <style>
        {`
          body {
            /* Ganti background di sini. Pilih salah satu. */
            background: linear-gradient(to top, #1a202c, #2d3748);
            min-height: 100vh;
            color: white;
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            display: flex; /* Make body a flex container to center things easily */
            justify-content: center; /* Center horizontally */
            align-items: center; /* Center vertically */
            flex-direction: column; /* Stack items vertically */
          }

          .title-overlay {
            position: absolute; /* Keep title absolute for top positioning */
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            z-index: 10;
          }

          .title-overlay h1 {
            font-size: 3rem;
            margin: 0;
            text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
          }

          .title-overlay p {
            font-size: 1.2rem;
            margin-top: 8px;
            text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.7);
          }

          /* --- Styling for the Microphone Button --- */
          .mic-button {
            width: 60px; /* Size of the button */
            height: 60px;
            border-radius: 50%; /* Makes it circular */
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            border: none; /* No default border */
            outline: none; /* No outline on focus */
            transition: background-color 0.3s ease, border-color 0.3s ease;
            position: fixed; /* Fixed position so it stays on screen */
            bottom: 30px; /* Adjust as needed */
            /* right: 30px; */ /* Or left: 30px if you prefer */
            left: 50%; /* Center horizontally */
            transform: translateX(-50%); /* Adjust for perfect centering */
            z-index: 100; /* Ensure it's above other elements */
          }

          .mic-button.muted {
            background-color: #ff3b30; /* Red for muted */
          }

          .mic-button.unmuted {
            background-color: #007bff; /* Blue for unmuted, or black/white as in your image */
            /* Or simply transparent with a border for the 'unmuted' state,
               similar to the white/black icons you provided:
               background-color: transparent;
               border: 2px solid white;
            */
          }

          /* Styling for the SVG icon inside the button */
          .mic-icon {
            fill: white; /* Default fill for the icon */
            width: 30px; /* Size of the SVG icon */
            height: 30px;
            transition: fill 0.3s ease;
          }

          /* Change icon color if button is muted and not using a red background */
          .mic-button.unmuted .mic-icon {
             fill: white; /* Icon is white on blue/black background */
          }
          .mic-button.muted .mic-icon {
             fill: white; /* Icon is white on red background */
          }
        `}
      </style>

      {/* TULISAN DITAMPILKAN DI SINI */}
      <div className="title-overlay">
        <h1>My Virtual Assistant</h1>
        <p>Interactive AI Character</p>
      </div>

      {/* --- Microphone Button --- */}
      <button
        className={`mic-button ${isMuted ? "muted" : "unmuted"}`}
        onClick={toggleMute}
      >
        {/* SVG Icon for Microphone */}
        <svg
          className="mic-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isMuted ? (
            // Muted icon (microphone with a line through it)
            <path d="M12 1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zM4 11c0 3.53 2.61 6.43 6 6.92V21h4v-3.08c3.39-.49 6-3.39 6-6.92h-2c0 2.95-2.02 5.42-4.72 5.92L12 16.99l-.02-.01c-.01 0-.01 0-.01 0c-2.7-.5-4.72-2.97-4.72-5.92H4zm13.62-5.18l-1.42 1.42c1.07 1.07 1.76 2.5 1.76 4.06 0 1.56-.69 2.99-1.76 4.06l1.42 1.42c1.47-1.47 2.4-3.52 2.4-5.48s-.93-4.01-2.4-5.48zM6.38 6.82L4.96 5.4C3.49 6.87 2.56 8.92 2.56 11c0 2.06.93 4.11 2.4 5.58l1.42-1.42c-1.07-1.07-1.76-2.5-1.76-4.06s.69-2.99 1.76-4.06z" />
          ) : (
            // Unmuted icon (standard microphone)
            <path d="M12 1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2s2-.9 2-2V3c0-1.1-.9-2-2-2zM4 11c0 3.53 2.61 6.43 6 6.92V21h4v-3.08c3.39-.49 6-3.39 6-6.92h-2c0 2.95-2.02 5.42-4.72 5.92L12 16.99l-.02-.01c-.01 0-.01 0-.01 0c-2.7-.5-4.72-2.97-4.72-5.92H4z" />
          )}
        </svg>
      </button>
    </>
  );
};

export default UI;
