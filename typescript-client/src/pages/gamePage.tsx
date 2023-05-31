import {
  Box,
  Button,
  ButtonBase,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Iconify from "../components/iconify";

export default function GamePage() {
  const [playerPoints, setPlayerPoints] = useState<number>(0);
  const [aiPoints, setAIPoints] = useState<number>(0);

  return (
    <>
      <Helmet>
        <title> Pedra, Papel... e AI?</title>
      </Helmet>
      <Grid // contador de pontos
        container
        item
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "fixed",
          top: "0",
        }}
      >
        <Grid item paddingX={3} borderTop={0}>
          <Typography padding={1} fontSize={20} fontFamily={"cursive"}>
            Você {`${playerPoints} - ${aiPoints}`} IA
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        spacing={6}
      >
        <Grid
          item
          container
          xs={8}
          md={6}
          lg={4}
          xl={3}
          justifyContent="center"
          flexDirection="row"
          gap={5}
        >
          <Grid item justifyContent="center">
            <IconButton color="inherit" sx={{ border: "1px solid black" }}>
              <Grid
                container
                width="75px"
                height="75px"
                justifyContent="center"
                alignItems="center"
              >
                1
              </Grid>
              {/* <Iconify icon="la:hand-rock-solid" width="75px" /> */}
            </IconButton>
          </Grid>
          <Grid item justifyContent="center">
            <IconButton color="inherit" sx={{ border: "1px solid black" }}>
              <Grid
                container
                width="75px"
                height="75px"
                justifyContent="center"
                alignItems="center"
              >
                2
              </Grid>
              {/* <Iconify icon="la:hand-paper-solid" width="75px" /> */}
            </IconButton>
          </Grid>
          <Grid item justifyContent="center">
            <IconButton color="inherit" sx={{ border: "1px solid black" }}>
              <Grid
                container
                width="75px"
                height="75px"
                justifyContent="center"
                alignItems="center"
              >
                3
              </Grid>
              {/*<Iconify icon="la:hand-scissors-solid" width="75px" />*/}
            </IconButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
