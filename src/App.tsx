import React, { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";

import { useAppDispatch } from "./store";
import { fetchLevelFromDB, syncEnum, syncDate, syncPref } from "./store/cards";
import { Insights } from "./components/insights";
import { Left } from "./components/left";
import { Right } from "./components/right";
import { Navbar } from "./components/navbar";

const Top = () => {
  // const [focus, setFocus] = useState<"left" | "right">("left");
  return (
    <Grid
      rowGap={8}
      columnGap={[0, null, 8]}
      m="24px"
      templateColumns="repeat(12, 1fr)"
    >
      <GridItem
        colSpan={[12, null, 7]}
        onMouseEnter={() => {
          // setFocus("left");
        }}
      >
        <Left />
      </GridItem>
      <GridItem
        colSpan={[12, null, 5]}
        onMouseEnter={() => {
          // setFocus("right");
        }}
      >
        <Right />
      </GridItem>
    </Grid>
  );
};

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    [0, 1, 2, 3, 4, 5, 6].forEach((level) => {
      dispatch(fetchLevelFromDB(level));
    });
    dispatch(syncEnum());
    dispatch(syncDate());
    dispatch(syncPref());
  }, []);

  return (
    <>
      <Navbar />
      <Top />

      <Insights />
    </>
  );
};

export default App;
