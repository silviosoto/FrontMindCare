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
  TablePagination
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useAppContext } from "../context/context";
import { getPaciente } from "../Services/Paciente.service";
import dayjs from "dayjs";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import {
  getFactruasPaginado
} from "../Services/facturas.service";
import "dayjs/locale/es";
import { useSimpleAlert, useConfirmationAlert } from "../hooks/useSwal";

const Facturas = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [citas, setCitas] = useState([]);
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

  const GetBilling = async () => {
    try {
      if (user == null) return;
      setCitas([]);
      const { items, totalPages, totalRecords } = await getFactruasPaginado(
        page,
        rowsPerPage
      );
      console.log("items", items);
      setCitas(items || []);
      setTotalRecords(totalRecords || 0);
    } catch (error) {
      simpleAlert("Algo salió mal", "", "error");
    }
  };
  const convertirHora = (hora24) => {
    const [hora, minutos, segundos] = hora24.split(":"); // Divide la hora
    const periodo = hora >= 12 ? "PM" : "AM"; // Determina si es AM o PM
    const hora12 = hora % 12 || 12; // Convierte a formato de 12 horas, manejando el caso de las 12
    return `${hora12}:${minutos} ${periodo}`; // Devuelve la hora en formato deseado
  };

  useEffect(() => {
    GetBilling();
  }, [page, rowsPerPage]);

  return (
   
      <TableContainer component={Paper} sx={{ borderRadius: 3,   border: "1px solid #ddd"}}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }} >
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>NumeroFactura</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>FechaEmision</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Psicologo</b>
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "#555" }}>
                <b>Paciente</b>
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
                <TableCell>{cita.numeroFactura}</TableCell>
                <TableCell>{formatDate(cita.fechaEmision)}</TableCell>
                <TableCell>
                  {" "}
                  Dr. {cita.psicologo.nombre} {cita.psicologo.apellidos}
                </TableCell>
                <TableCell>{cita.paciente.nombre} {cita.paciente.apellidos}</TableCell>
                <TableCell>
                  <Chip
                    label={cita.estadoFactura}
                    size="small"
                    sx={{ mt: 2 }}
                  />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    startIcon={<FormatListNumberedIcon  />}
                    sx={{ mr: 1 }}
                    onClick={() => GetIntoSala(cita.url, cita.token, cita.id)}
                  >
                    Detalle
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

export default Facturas;
