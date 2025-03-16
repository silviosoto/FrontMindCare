'use client';
import { useEffect, useRef, useState } from "react";
import { Routes } from "../routes";
import { usePathname, useParams } from "next/navigation";
 
import { ContextProvider } from "../context/context";
import { useAppContext } from "../context/context";
import { Loading } from "../../app/components/loading.component";
import { Layout } from "../../app/layouts/layout.layout";
import {NotFound} from "../errors/notFound";
import {Unauthorize} from "../errors/unauthorize";
import {Forbidden} from "../errors/forbidden"; 
export const ProtectedRoutesProvider = (props) => {
	const [loading, setLoading] = useState(true);
	
	const {
		children
	} = props;

	const loadingTimeOut = useRef(500);
	const  {user}  = useAppContext();
	const pathname = usePathname();
	const params = useParams();
	const [key] = Object.keys(params);
	// const basePath = pathname.replace(`/${params[key]}`, '');
	const isDynamicRoute = () => {
		console.log(Object.keys(params).length > 0)
		return Object.keys(params).length > 0; // Si hay parámetros, es dinámica
	};
	

	useEffect(() => {
		setTimeout(() => setLoading(false) , loadingTimeOut.current);
	}, [])

	const render = (content) => {	  
		let _path = pathname;  
  		// console.log(`Ruta sin valor dinámico: ${basePath}`);
		// console.log("*** pathname", pathname)
		
		if (isDynamicRoute()) 
		{
			_path = pathname.replace(`/${params[key]}`, '');
		}
		
		const currentRoute = Routes.find(route => {
			let _routePath = route.path;
			// if (route.path.includes(":")) _routePath = route.path.slice(0, route.path.indexOf(":") - 1);
			return _routePath === _path
		}); 

		if (currentRoute) {
		 
			if (!user) return <Unauthorize />;
			else if (currentRoute.roles?.length !== 0 && !currentRoute.roles?.includes(user?.profile)) return <Forbidden />;
		} 
	 
		let useLayout;
		if (!currentRoute) useLayout = false;
		else useLayout = currentRoute.layout ?? true;
 
		let navRoutes; 
		
		if (user) navRoutes = Routes.filter(route => route.authorize === false || route.roles.length === 0 || route.roles.includes(user?.profile))
			return (
				<Layout
					use={useLayout}
					navRoutes={[{navRoutes}]} >
					{ content }
				</Layout>
			)
	} 

	return loading ? <Loading /> : render(children)
}