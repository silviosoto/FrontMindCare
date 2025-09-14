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
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import { useAppContext } from "../context/context";
import { getPaciente } from "../Services/Paciente.service";
import dayjs from "dayjs";
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import {
  getFacturasbyPaciente,
  downLoadFactura
} from "../Services/facturas.service"; 
import "dayjs/locale/es";
import { useSimpleAlert, useConfirmationAlert } from "../hooks/useSwal";
import { useCookie } from "../hooks/useCookie.hook"; 

const cookieStorage = useCookie();
const Pagos = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [citas, setCitas] = useState([]);
  const simpleAlert = useSimpleAlert();  
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

  const GetBilling = async (idPaciente) => {
    try {
    
      if (user == null) return;
      setCitas([]);
      const { items, totalPages, totalRecords } = await getFacturasbyPaciente(
        idPaciente,
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

  const getInfoPaciente = async (id) => {
    try {
      if (user == null) return;

      const data = await getPaciente(id);
      if (data != undefined) {
        const { paciente } = data;
        await GetBilling(paciente.id);
      }
    } catch (error) {
      console.log("getPaciente", error);
    }
  };


  const descargarPdf = async (idFactura) => {
    try{
      const response = await downLoadFactura(idFactura); 
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Factura_${idFactura}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }catch(ex){
      console.log(ex)
      simpleAlert("Error al descargar la factura", "", "error");
    } 
    
  };

  useEffect(() => {
    let userid = cookieStorage.get("userid");
    getInfoPaciente(userid);
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
                <b>Servicio</b>
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
                <TableCell>{cita.facturaDetalle[0].descripcion}</TableCell>
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
                    startIcon={<SimCardDownloadIcon  />}
                    sx={{ mr: 1 }}
                    onClick={() => descargarPdf(cita.id)}
                  >
                    Descargar
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

export default Pagos;
