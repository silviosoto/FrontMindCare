"use client"
import { useEffect, useState } from 'react';
import VideoCall from '../components/DailyVideoCall';
import { useSearchParams  } from "next/navigation";

export default function CallPage() {
   
  const searchParams = useSearchParams();
  const roomid = searchParams.get('roomid');
  const token = searchParams.get('token');
  const userid = searchParams.get('userid');
  const [roomUrl, setRoomUrl] = useState('');

  // Obtener la URL de la sala al cargar
  useEffect(() => {
    setRoomUrl(`https://mindcareappvc.daily.co/${roomid}`);
    if (roomid == undefined) return;
  }, [roomid]);

  if (!roomUrl) return <div>Cargando...</div>;

  return (
    <>
      <h1>Sesión de Terapias</h1>
      {
        roomUrl  && (<VideoCall roomUrl={roomUrl} token={token} userid={userid}/>)
      }
   </>
  );
}