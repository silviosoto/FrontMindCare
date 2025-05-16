import React from "react";
import { Box, Grid } from "@mui/material";
import ProfileCard from "./profileCard";
// import ProfileCard from "./ProfileCard";
import { useRouter } from "next/navigation";



const ProfileList = ({ profiles }) => {
  const router = useRouter();
  const handleViewProfile = (id) => {
    router.push(`/psicologo/${id}`); 
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 1
      }}
    >
      {profiles.map((profile, index) => (
        <>
          <ProfileCard
            key={index}
            id={profile.id}
            name={profile.nombre}
            phone={profile.telefono}
            imageUrl={profile.imagePerfil}
            descripcion={profile.descripcion}
            experience={profile.experiencia || 0}
            onViewProfile={handleViewProfile}
          />
        </>
      ))}
    </Box>
  );
};

export default ProfileList;
