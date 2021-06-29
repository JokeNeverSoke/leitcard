import React, { useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  Paper,
  TextField,
  Toolbar,
} from "@material-ui/core";
import ReactCardFlip from "react-card-flip";
import Markdown from "markdown-to-jsx";
import { VictoryBar, VictoryChart, VictoryAxis } from "victory";
import { useSnackbar } from "notistack";

import {
  useAppSelector,
  showCardsInLevel,
  useAppDispatch,
  selectTodayLevel,
  selectAllLevels,
} from "./store";
import {
  addCard,
  fetchLevelFromDB,
  incrementDate,
  resetCard,
  upgradeCard,
  updatePostToDB,
  syncEnum,
} from "./store/cards";
import { Typography } from "@material-ui/core";

const Left = () => {
  const dispatch = useAppDispatch();
  const levels = useAppSelector(selectTodayLevel);
  const currentEnum = useAppSelector((state) => state.cards.currentEnum);
  const babyCards = useAppSelector(showCardsInLevel(levels[0]));
  const currentCards = useAppSelector(showCardsInLevel(levels[1]));
  const [flipped, setFlipped] = useState(false);
  const cards = babyCards
    .concat(currentCards)
    .filter((c) => c.lastEnum < currentEnum);
  const curCard = cards[0];
  useEffect(() => {
    [0, 1, 2, 3, 4, 5, 6].forEach((level) => {
      dispatch(fetchLevelFromDB(level));
    });
    dispatch(syncEnum());
  }, []);
  if (cards.length) {
    return (
      <ReactCardFlip isFlipped={flipped} infinite>
        <Card onClick={() => setFlipped(!flipped)} key="front">
          <CardHeader title={`Level ${curCard.status + 1}`} />
          <CardContent style={{ textAlign: "center" }}>
            <Typography>
              <Markdown>{curCard.question}</Markdown>
            </Typography>
          </CardContent>
        </Card>

        <Card onClick={() => setFlipped(!flipped)} key="back">
          <CardHeader title={`Answer`} />
          <CardContent style={{ textAlign: "center" }}>
            <Typography>
              <Markdown>{curCard.answer}</Markdown>
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(upgradeCard(curCard));
                setFlipped(false);
              }}
            >
              Got it!
            </Button>
            <Button
              color="secondary"
              onClick={(e) => {
                e.stopPropagation();
                dispatch(resetCard(curCard));
                setFlipped(false);
              }}
            >
              Incorrect
            </Button>
          </CardActions>
        </Card>
      </ReactCardFlip>
    );
  } else {
    return (
      <Card>
        <CardContent style={{ textAlign: "center" }}>
          <Typography variant="body1">You're all done for today!</Typography>
          <Button
            onClick={() => {
              dispatch(incrementDate());
            }}
            color="primary"
          >
            Proceed to next day
          </Button>
        </CardContent>
      </Card>
    );
  }
};

const Right = () => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const textFieldStyles = {
    width: "50%",
  };
  return (
    <>
      <div>
        <TextField
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          multiline
          variant="outlined"
          label="Question"
          style={textFieldStyles}
        />
        <TextField
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          multiline
          variant="outlined"
          label="Answer"
          style={textFieldStyles}
        />
      </div>
      <div>
        <Button
          onClick={() => {
            dispatch(addCard({ question, answer }));
            setQuestion("");
            setAnswer("");
            enqueueSnackbar("Card added!");
          }}
        >
          Submit
        </Button>
      </div>
    </>
  );
};

const Top = () => {
  const [focus, setFocus] = useState<"left" | "right">("left");
  return (
    <Grid spacing={2} style={{ margin: "24px 0" }} container>
      <Grid
        item
        xs={focus === "left" ? 8 : 3}
        onMouseEnter={() => {
          setFocus("left");
        }}
        style={{ transition: "width 0.3s ease-in-out" }}
      >
        <Left />
      </Grid>
      <Grid
        item
        xs={focus === "right" ? 9 : 4}
        onMouseEnter={() => {
          setFocus("right");
        }}
        style={{ transition: "width 0.3s ease-in-out" }}
      >
        <Right />
      </Grid>
    </Grid>
  );
};

const Amount = () => {
  const levels = useAppSelector(selectAllLevels);
  const data = levels.map((level, index) => {
    return {
      x: index + 1,
      y: level.length,
    };
  });
  return (
    <VictoryChart domainPadding={20}>
      <VictoryAxis
        tickValues={[1, 2, 3, 4, 5, 6, 7]}
        tickFormat={[1, 2, 3, 4, 5, 6, 7].map((i) => `Level ${i}`)}
      />
      <VictoryAxis dependentAxis />
      <VictoryBar data={data} />
    </VictoryChart>
  );
};

const App = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">LeitCard</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Top />

        <Amount />
      </Container>
    </>
  );
};

export default App;
