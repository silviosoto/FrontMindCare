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
		name: "psicologos",
		path: "/listaPsicologos",
		roles: [ "Paciente" ]
	},
	{
		name: "psicologo",
		path: "/psicologo",
		roles: [ "Paciente" ]
	},
	// {
	// 	name: "registrerpacient",
	// 	path: "/registrerPacient",
	// 	layout: false,
	// 	roles: []
	// }
]; 