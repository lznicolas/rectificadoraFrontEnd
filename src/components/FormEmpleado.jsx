import React, { useState } from "react";
import { Box, TextField, Typography, Grid, Stack, Grid2 } from "@mui/material";

const FormEmpleado =() =>{
    return(

    
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
                p: 3
                }}
        >
            <Grid ontainer spacing={3}>
                <Grid item xs={12} sm={4} >
                    <Stack spacing={1}>
                        <Typography variant="h6" sx={{color:"black"}}>
                            Legajo:  
                        </Typography>
                        <TextField 
                            fullWidth
                            label = "Legajo"
                            variant="outlined"
                            name = "legajo"
                        />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={4} >
                    <Stack spacing={1}>
                        <Typography variant="h6" sx={{color:"black"}}>
                            Sueldo:  
                        </Typography>
                        <TextField 
                            fullWidth
                            label = "Sueldo"
                            variant="outlined"
                            name = "sueldo"
                        />
                    </Stack>
                </Grid> 
                <Grid item xs={12} sm={6} >
                    <Stack spacing={1}>
                        <Typography variant="h6" sx={{color:"black"}}>
                            Especialidad:  
                        </Typography>
                        <TextField 
                            fullWidth
                            label = "Especialidad"
                            variant="outlined"
                            name = "especialidad"
                        />
                        </Stack>
                    </Grid> 
            </Grid>
        </Box>
    );
}
export default FormEmpleado