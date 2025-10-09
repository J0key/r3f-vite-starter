import React, { useRef, useState, useCallback } from "react";
import { Avatar } from "./Avatar";

/*
  This component shows how to wire your existing start() and onDataMessage
  logic to the Avatar via avatarRef.

  - Place this component somewhere in your app UI.
  - It provides Connect / Hangup buttons and a hidden audio element (remoteAudio)
  - When a remote track is received, we call avatarRef.current.StartTalking(stream)
  - When you detect response.audio_transcript.done or response.done, we call StopTalking
*/

export default function RealtimeController({ initialModel = "gpt-4o-mini-realtime-preview" }) {
  const avatarRef = useRef(null);
  const pcRef = useRef(null);
  const dcRef = useRef(null);
  const micStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);

  const [connected, setConnected] = useState(false);
  const [muted, setMuted] = useState(false);

  // REUSE your existing helper functions: sendEvent, startRecordingBuffer, executeFunctionCall, getRecentAudioBlob...
  // For demo completeness, I assume they exist globally or import them here.
  // If they're not global, import or pass them as props.

  const onDataMessage = useCallback(async (ev) => {
    try {
      const data = JSON.parse(ev.data);
      console.log("Event:", data);

      // Keep your debug logging here...
      // Example: handle transcript done and stop avatar talking
      if (data.type === "response.audio_transcript.delta") {
        // updateAITranscript(data.delta);
        return;
      }

      if (data.type === "response.audio_transcript.done") {
        // updateAITranscript("", true);
        // the model finished speaking — stop avatar talking
        console.log("AI transcript done:", data.transcript);
        try {
          avatarRef.current?.StopTalking();
        } catch (e) {
          console.warn("Avatar StopTalking failed:", e);
        }
        return;
      }

      // Also stop on response.done just in case
      if (data.type === "response.done") {
        try {
          avatarRef.current?.StopTalking();
        } catch (e) {}
      }

      // ... then keep your existing handlers for function calls, response.output_item.added, etc.
      // If you have executeFunctionCall, call it here where your original code did.
    } catch (err) {
      console.error("onDataMessage error:", err);
    }
  }, []);

  async function start() {
    // mostly your original start() code but keep references local
    const SESSION_MINUTES = 15;
    const MODEL = initialModel;

    // get ephemeral key from your server /session endpoint (same as before)
    const sess = await fetch("/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ minutes: SESSION_MINUTES }),
    }).then((r) => r.json());

    if (!sess || !sess.client_secret?.value) {
      console.error("Failed to get session");
      return;
    }
    const EPHEMERAL_KEY = sess.client_secret.value;

    // create peer connection
    const pc = new RTCPeerConnection();
    pcRef.current = pc;

    // data channel for events
    const dc = pc.createDataChannel("oai-events");
    dc.onopen = () => console.log("DataChannel open");
    dc.onmessage = onDataMessage;
    dcRef.current = dc;

    // get mic
    const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStreamRef.current = micStream;

    // If you have startRecordingBuffer, call it to fill the circular buffer
    if (typeof window.startRecordingBuffer === "function") {
      await window.startRecordingBuffer(micStream);
    }

    // add local tracks
    micStream.getTracks().forEach((t) => {
      pc.addTrack(t, micStream);
    });

    // when remote track arrives
    pc.ontrack = (e) => {
      const [stream] = e.streams;
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        // attempt play (should be allowed because user clicked connect)
        remoteAudioRef.current.play().catch((e) => {
          console.warn("Remote audio autoplay blocked:", e);
        });
      }
      // Tell avatar to play & lipsync
      // We don't have phoneme JSON from the model by default, so pass only stream -> Avatar will use the analyser fallback.
      try {
        avatarRef.current?.StartTalking(stream, /* optional lipsyncJson */ null);
      } catch (e) {
        console.warn("Avatar StartTalking failed:", e);
      }
    };

    // create offer and set local desc
    const offer = await pc.createOffer({ offerToReceiveAudio: true });
    await pc.setLocalDescription(offer);

    // send SDP to OpenAI Realtime endpoint (with ephemeral key)
    const sdpResponse = await fetch(
      `https://api.openai.com/v1/realtime?model=${encodeURIComponent(MODEL)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp",
        },
        body: offer.sdp,
      }
    );

    const answer = { type: "answer", sdp: await sdpResponse.text() };
    await pc.setRemoteDescription(answer);

    setConnected(true);
    console.log("Connected to Realtime via WebRTC.");
  }

  async function end() {
    try {
      if (pcRef.current) {
        pcRef.current.getSenders().forEach((s) => {
          if (s.track) s.track.stop();
        });
        pcRef.current.close();
      }
    } catch (e) {
      console.warn("End error", e);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    // Make sure avatar stops talking
    try {
      avatarRef.current?.StopTalking();
    } catch (e) {}

    setConnected(false);
  }

  function toggleMute() {
    if (!micStreamRef.current) return;
    const t = micStreamRef.current.getAudioTracks()[0];
    if (!t) return;
    t.enabled = !t.enabled;
    setMuted(!t.enabled);
  }

  return (
    <div>
      <div>
        <button onClick={start} disabled={connected}>
          Connect
        </button>
        <button onClick={end} disabled={!connected}>
          Hangup
        </button>
        <button onClick={toggleMute}>{muted ? "Unmute" : "Mute"}</button>
      </div>

      {/* Hidden audio element used for debugging / fallback playback */}
      <audio ref={remoteAudioRef} hidden />

      {/* Your 3D canvas / avatar. Pass the avatarRef to access StartTalking / StopTalking. */}
      <div style={{ width: 600, height: 600 }}>
        {/* Insert your Canvas root and Avatar here; for example: */}
        {/* <Canvas> <Avatar ref={avatarRef} position={[0, -1.5, 0]} /> </Canvas> */}
        {/* Or if using a parent component: */}
        <Avatar ref={avatarRef} playAudio={false} />
      </div>
    </div>
  );
}