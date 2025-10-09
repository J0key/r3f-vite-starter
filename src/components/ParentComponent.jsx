import React, { useState } from 'react';
import UI from './UI';
import { Avatar } from './Avatar'; 
// Asumsi Anda menggunakan Leva di Avatar, kita akan ganti kontrol playAudio-nya.

const ParentComponent = () => {
  // State diangkat ke sini
  const [isMuted, setIsMuted] = useState(false); 

  // playAudio adalah kebalikan dari isMuted (Unmuted = True)
  const shouldPlayAudio = !isMuted; 

  return (
    <div>
      {/* Meneruskan state dan setter ke UI */}
      <UI isMuted={isMuted} setIsMuted={setIsMuted} />
      
      {/* Meneruskan status audio ke Avatar */}
      <Avatar playAudio={shouldPlayAudio} /> 
    </div>
  );
};

export default ParentComponent;