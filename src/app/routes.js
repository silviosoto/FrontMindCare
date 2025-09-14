export const Routes = [
	{
		name: "Home",
		path: "/dashboard",
		roles: []
	},
	{
		name: "Perfil",
		path: "/profile",
		roles: ["SuperAdmin", "Admin", "Psicologo"]
	},
	{
		name: "Agenda",
		path: "/agenda",
		roles: ["SuperAdmin", "Admin", "Psicologo"]
	},
	{
		name: "Servicios",
		path: "/psychologyServices",
		roles: ["SuperAdmin", "Admin", "Psicologo"]
	},
	{
		name: "Reportes",
		path: "/reportes",
		roles: ["SuperAdmin", "Admin", "Psicologo"],
	},
	{
		name: "Perfiles",
		path: "/profilepaciente",
		roles: [ "Paciente" ]
	},
	{
		name: "Psicologos",
		path: "/listaPsicologos",
		roles: [ "Paciente" ]
	},
	{
		name: "Psicologo",
		path: "/psicologo",
		hide: true,
		roles: [ "Paciente" ]
	},
	{
		name: "Cita",
		path: "/cita",
		roles: [ "Paciente" ]
	},
	{
		name: "Appointment",
		path: "/appointment",
		hide: true,
		roles: [ "Paciente" ]
	}, 
	{
		name: "Facturación",
		path: "/billing",
		roles: [ "SuperAdmin", "Admin" ]
	}, 
	{
		name: "Mis pagos",
		path: "/pagos",
		roles: [ "Paciente" ]
	}, 
]; 