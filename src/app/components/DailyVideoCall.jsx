"use client";
import { DailyProvider, DailyVideo } from "@daily-co/daily-react";
import { useCallFrame } from "@daily-co/daily-react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  useSimpleAlert,
  useConfirmationAlert
} from "../hooks/useSwal";

export default function VideoCall({ roomUrl, token, userid }) {

  const [stateCall, setStateCall] = useState("");
  const router = useRouter();
  const simpleAlert = useSimpleAlert();
  
  const callFrame = useCallFrame({
    options: {
      showLeaveButton: true,
      iframeStyle: {
        position: "absolute",
        width: "90%",
        height: "80%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        border: "none",
      },
    },
  });
 
  // Unirse a la sala
  useEffect(() => {
    try {
    // toString(userid)
    // console.log("****** BUGG *********", roomUrl, token, userid);
      if (!callFrame || !roomUrl) return;
      if (stateCall === "left-meeting") return;

      callFrame.join({
        url: roomUrl,
        token: token,
        userData: {
          userId: toString(userid), // ¡Asegúrate de enviar este dato!
          name: "Dr. Pérez",
          role: "host", // o "guest",
        },
      });

      callFrame.on("joined-meeting", () => {
        console.log("Joined meeting ******************");
        setStateCall("joined-meeting");
      });

      callFrame.on("left-meeting", () => {
        console.log("Left meeting ******************");
        setStateCall("left-meeting");
        router.push("/cita");
        callFrame.destroy();
      });

      callFrame.on("error", (event) => {
        console.log("error meeting ******************", event);
        simpleAlert("Ha ocurrido un error", event.errorMsg, "error");
        setStateCall("left-meeting");
        router.push("/cita");
        callFrame.destroy();
       
      });

    } catch (e) {
      console.log("Error al cargar DailyIframe:", e);
      simpleAlert("Error al unirse", "", "error");
    }

    return () => {
      callFrame.leave();
      callFrame.destroy();
    };
  }, [callFrame, roomUrl]);

  return (
    <>
      <div
        id="contenedordeframe"
        style={{
          position: "relative",
          width: "90%",
          height: "500px",
          left: "10%",
          top: "30%",
        }}
      >
        <DailyProvider callObject={callFrame}>
          <DailyVideo />
        </DailyProvider>
      </div>
    </>
  );
}
