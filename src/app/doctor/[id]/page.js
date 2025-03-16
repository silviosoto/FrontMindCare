"use client";
import { useParams } from "next/navigation";
export default function Page() {
  const { id } = useParams();
    console.log("doctor id", id)
     
  return <div>My Post:{id}</div>
} 