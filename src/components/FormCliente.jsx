import React, { useState } from "react";
import { Box, TextField, Typography, Grid, Stack, Grid2 } from "@mui/material";

const FormCliente =() => {
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
            <Grid container spacing={3}>
               <Grid item xs={12} sm={6} >
                <Stack spacing={1}>
                    <Typography variant="h6" sx={{color:"black"}}>
                        Credito:  
                    </Typography>
                    <TextField 
                        fullWidth
                        label = "Credito"
                        variant="outlined"
                        name = "credito"
                    />
                    </Stack>
                </Grid>
                <Grid item xs={12} sm={6} >
                <Stack spacing={1}>
                    <Typography variant="h6" sx={{color:"black"}}>
                        Saldo:  
                    </Typography>
                    <TextField 
                        fullWidth
                        label = "Saldo"
                        variant="outlined"
                        name = "saldo"
                    />
                    </Stack>
                </Grid> 
                <Grid item xs={12} sm={6} >
                <Stack spacing={1}>
                    <Typography variant="h6" sx={{color:"black"}}>
                        Observaciones: 
                    </Typography>
                    <TextField 
                        fullWidth
                        label = "Observaciones"
                        variant="outlined"
                        name = "observaciones"
                        multiline
                        rows={4}
                    />
                </Stack>
               </Grid>    
            </Grid> 
        </Box>
    );

}
export default FormCliente