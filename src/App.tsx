import React, { useState, useEffect, useRef } from "react";
import {
  useToast,
  Button,
  ButtonGroup,
  Box,
  Textarea,
  Text,
  Grid,
  GridItem,
  SimpleGrid,
  useTheme,
  Heading,
  useDisclosure,
  Tooltip,
  Switch,
  Center,
} from "@chakra-ui/react";
import ReactCardFlip from "react-card-flip";
import Markdown from "markdown-to-jsx";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel } from "victory";

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
  syncDate,
} from "./store/cards";
import { AddIcon } from "@chakra-ui/icons";
import { getStatus } from "./utils/findStatuses";

const Card = (props: React.ComponentProps<typeof Box>) => {
  return (
    <Box
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor="gray.200"
      transition="0.2s ease-in-out"
      _hover={{
        boxShadow: "lg",
      }}
      {...props}
    />
  );
};

const CardContent = (props: React.ComponentProps<typeof Box>) => {
  return (
    <Box
      borderBottom="solid 1px"
      borderColor="gray.200"
      py={2}
      px={5}
      {...props}
    />
  );
};

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
  if (cards.length) {
    return (
      <ReactCardFlip isFlipped={flipped} infinite>
        <Card onClick={() => setFlipped(!flipped)} key="front">
          <CardContent>{`Level ${curCard.status + 1}`}</CardContent>
          <CardContent textAlign="center">
            <Text>
              <Markdown>{curCard.question}</Markdown>
            </Text>
          </CardContent>
        </Card>

        <Card onClick={() => setFlipped(!flipped)} key="back">
          <CardContent
            borderBottom="solid 1px"
            borderColor="gray.200"
            py={2}
            px={5}
          >
            Answer
          </CardContent>
          <CardContent
            borderBottom="solid 1px"
            borderColor="gray.200"
            py={3}
            px={5}
            textAlign="center"
          >
            <Text>
              <Markdown>{curCard.answer}</Markdown>
            </Text>
          </CardContent>
          <CardContent>
            <ButtonGroup size="xs" variant="ghost" spacing={2}>
              <Button
                colorScheme="green"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(upgradeCard(curCard));
                  setFlipped(false);
                }}
              >
                Got it!
              </Button>
              <Button
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(resetCard(curCard));
                  setFlipped(false);
                }}
              >
                Incorrect
              </Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </ReactCardFlip>
    );
  } else {
    return (
      <Card pt={5} pb={4} px={5} textAlign="center">
        <Text>You're all done for today!</Text>
        <Tooltip
          hasArrow
          label="The point of the leitner system is to span repetition over time on 'the sweet spot'"
          borderRadius="md"
          textAlign="center"
        >
          <Button
            onClick={() => {
              dispatch(incrementDate());
            }}
            color="gray.300"
            size="xs"
            variant="ghost"
          >
            Proceed to next day (not recommended)
          </Button>
        </Tooltip>
      </Card>
    );
  }
};

const EditableMarkdown = ({
  value,
  onChange,
  placeholder,
}: {
  onChange: (e: any) => void;
  value: string;
  placeholder: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Box>
      <Textarea
        ref={textareaRef}
        onBlur={onClose}
        value={value}
        onChange={(e) => onChange(e)}
        display={!isOpen ? "none" : undefined}
        placeholder={placeholder}
      />
      <Tooltip label="Click me!" hasArrow placement="left">
        <Text
          tabIndex={0}
          onClick={() => {
            onOpen();
            setTimeout(() => textareaRef.current?.focus());
          }}
          display={isOpen ? "none" : undefined}
          cursor="pointer"
          _hover={{
            textDecoration: "underline",
          }}
        >
          <Markdown>{value || placeholder}</Markdown>
        </Text>
      </Tooltip>
    </Box>
  );
};

const Right = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [reversible, setReversible] = useState(false);
  return (
    <Card>
      <CardContent>
        <Heading size="sm">Add new card</Heading>
      </CardContent>
      <CardContent>
        <EditableMarkdown
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
        />
        <EditableMarkdown
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Answer"
        />
        <Tooltip label="Will be implemented in the future">
          <Box>
            Is reversable?
            <Switch
              ml={2}
              isChecked={reversible}
              onChange={(e) => setReversible(e.target.checked)}
              isDisabled
            />
          </Box>
        </Tooltip>
      </CardContent>
      <CardContent>
        <Button
          colorScheme="blue"
          leftIcon={<AddIcon />}
          size="sm"
          onClick={() => {
            dispatch(addCard({ question, answer }));
            setQuestion("");
            setAnswer("");
            toast({ title: "Card added!", status: "success" });
          }}
        >
          Submit
        </Button>
      </CardContent>
    </Card>
  );
};

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

const Amount = () => {
  const levels = useAppSelector(selectAllLevels);
  const { colors } = useTheme();
  const data = levels.map((level, index) => {
    return {
      x: index + 1,
      y: level.length,
    };
  });
  return (
    <>
      <VictoryChart domainPadding={20}>
        <VictoryLabel
          y={20}
          x={200}
          text="Card Count in Levels"
          textAnchor="middle"
        />
        <VictoryAxis
          tickValues={[1, 2, 3, 4, 5, 6, 7]}
          tickFormat={[1, 2, 3, 4, 5, 6, 7].map((i) => `Level ${i}`)}
        />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={data}
          style={{
            data: {
              fill: ({ datum }) => {
                switch (datum.x % 5) {
                  case 0:
                    return colors.red[400];
                  case 1:
                    return colors.green[400];
                  case 2:
                    return colors.orange[400];
                  case 3:
                    return colors.yellow[400];
                  case 4:
                    return colors.purple[400];
                  default:
                    return colors.gray[400];
                }
              },
            },
          }}
        />
      </VictoryChart>
    </>
  );
};

const Day = () => {
  const currentEnum = useAppSelector((state) => state.cards.currentEnum);
  return (
    <Center h="100%">
      <Heading>Day {currentEnum}</Heading>
    </Center>
  );
};

const GradCards = () => {
  const gradCardsCount = useAppSelector((state) => state.cards.grads.length);
  const status = getStatus(gradCardsCount);
  return (
    <Center h="100%" color={status.color}>
      <Box textAlign="center">
        <Heading>Cards Graduated: {gradCardsCount}</Heading>
        <Heading textDecoration="underline" size="md">
          {status.title}
        </Heading>
      </Box>
    </Center>
  );
};

const Insights = () => {
  return (
    <SimpleGrid columns={[1, null, 2, 3]} spacing={6} p={7}>
      <Card p={2} h="sm">
        <GradCards />
      </Card>
      <Card p={2} h="sm">
        <Amount />
      </Card>
      <Card p={2} h="sm">
        <Day />
      </Card>
    </SimpleGrid>
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
  }, []);

  return (
    <>
      <Top />

      <Insights />
    </>
  );
};

export default App;
