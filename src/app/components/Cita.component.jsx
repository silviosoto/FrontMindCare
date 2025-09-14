"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  TablePagination,
  Typography,
  Box,
  Divider
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/context";
import { getPaciente } from "../Services/Paciente.service";
import dayjs from "dayjs";
import { Delete, VideoCall } from "@mui/icons-material";
import {
  getCitasByPaciente,
  CancelAppointment,
  confirmAppointment,
} from "../Services/cita.service";
import "dayjs/locale/es";
import { useSimpleAlert, useConfirmationAlert } from "../hooks/useSwal";

const Citas = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [citas, setCitas] = useState([]);
  const [paciente, setPaciente] = useState(null);
  const simpleAlert = useSimpleAlert();
  const confirmationAlert = useConfirmationAlert();
  const router = useRouter();
  const { user } = useAppContext();

  const formatDate = (dateString) => {
    dayjs.locale("es");
    return dayjs(dateString).format("dddd, D [de] MMMM [de] YYYY");
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchCitas = async (idPaciente) => {
    try {
      if (user == null) return;
      setCitas([]);
      const { items, totalPages, totalRecords } = await getCitasByPaciente(
        idPaciente,
        page,
        rowsPerPage
      );

      setCitas(items || []);
      setTotalRecords(totalRecords || 0);
    } catch (error) {
      simpleAlert("Algo salió mal", "", "error");
    }
  };

  const cancelarCita = async (idCita) => {
    try {
      const confirmed = await confirmationAlert(
        "¿Estás seguro?",
        "¿Quieres cancelar la cita?",
        "Sí, continuar",
        "Cancelar"
      );
      if (!confirmed) return;

      const citas = await CancelAppointment(idCita);

      if (citas) {
        simpleAlert("cancelada exitosamente", "", "success");
      } else {
        simpleAlert("No se pudo cancelar la cita", "", "error");
      }

      fetchCitas();
    } catch (error) {
      simpleAlert("Algo salió mal", "", "error");
    }
  };

  const getInfoPaciente = async (id) => {
    try {
      if (user == null) return;

      const data = await getPaciente(id);
      if (data != undefined) {
        const { paciente } = data;
        // setPaciente(paciente);
        await fetchCitas(paciente.id);
      }
    } catch (error) {
      console.log("getPaciente", error);
    }
  };

  const GetIntoSala = async (UrlSala, token, idCita) => {
    if (UrlSala) {
      var response = await confirmAppointment(idCita); // Confirmar la cita antes de unirse a la sala

      if (!response) {
        simpleAlert("Cita confirmada", "", "success");
        return;
      }

      const roomId = UrlSala.split("/").pop(); // Extraer el roomId de la URL
      router.push(
        `/call?roomid=${roomId}&token=${token}&userid=${user.userid}`
      ); // Redirigir a la página de llamada con el roomId
    } else {
      simpleAlert("No se pudo acceder la sala", "", "error");
    }
  };

  const isExpiredAppointment = (fechaCita, horaCita) => {
    let fechaCitaconvert = fechaCita.split("T")[0];
    let date = new Date(fechaCitaconvert + "T" + horaCita);
    let now = new Date();
    return now > date;
  };

  const convertirHora = (hora24) => {
    const [hora, minutos, segundos] = hora24.split(":"); // Divide la hora
    const periodo = hora >= 12 ? "PM" : "AM"; // Determina si es AM o PM
    const hora12 = hora % 12 || 12; // Convierte a formato de 12 horas, manejando el caso de las 12
    return `${hora12}:${minutos} ${periodo}`; // Devuelve la hora en formato deseado
  };

  useEffect(() => {
    getInfoPaciente(user.userid);
  }, [page, rowsPerPage]);

  return (
   
      <TableContainer component={Paper} sx={{ borderRadius: 3,   border: "1px solid #ddd"}}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }} >
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Fecha</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Hora</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Psicólogo</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Servicio</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Estado</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }} align="center">
                <b>Acciones</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {citas.map((cita, i) => (
              <TableRow key={cita.id}>
                <TableCell>{formatDate(cita.fecha)}</TableCell>
                <TableCell>{convertirHora(cita.hora)}</TableCell>
                <TableCell>
                  {" "}
                  Dr. {cita.nombre} {cita.apellidos}
                </TableCell>
                <TableCell>{cita.servicio}</TableCell>
                <TableCell>
                  <Chip
                    label={cita.estadoString}
                    color={
                      cita.estadoString === "Confirmada"
                        ? "success"
                        : cita.estadoString === "Apartada"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<VideoCall />}
                    sx={{ mr: 1 }}
                    onClick={() => GetIntoSala(cita.url, cita.token, cita.id)}
                    disabled={isExpiredAppointment(cita.fecha, cita.hora)}
                  >
                    Unirse
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => cancelarCita(cita.id)}
                    disabled={
                      cita.estadoString === "Cancelada" ||
                      isExpiredAppointment(cita.fecha, cita.hora)
                    }
                  >
                    Cancelar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalRecords}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Citas por página"
        />
      </TableContainer> 
  );
};

export default Citas;
