import {
  Center,
  color,
  Heading,
  SimpleGrid,
  textDecoration,
  useTheme,
  Box,
  Text,
  Progress,
} from "@chakra-ui/react";
import React from "react";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel } from "victory";
import {
  selectAllLevels,
  selectCardsCompletedToday,
  selectTodayLevel,
  selectTodoCards,
  useAppSelector,
} from "../store";
import { getStatus } from "../utils/findStatuses";
import { Card } from "./cards";

const Stat: React.FC<{ label: string; progress?: number }> = ({
  label,
  children,
  progress,
}) => {
  const hasProgress = typeof progress === "number";
  return (
    <Box mb={2} minW={32}>
      <Box fontSize="xs" color="gray.700" mb={hasProgress ? undefined : -1}>
        {label}
      </Box>
      {hasProgress ? (
        <Box position="relative">
          <Box
            zIndex={10}
            color="white"
            position="relative"
            fontSize="2xl"
            textAlign="center"
          >
            {children}
          </Box>
          <Progress
            h="100%"
            w="full"
            position="absolute"
            top="0"
            background="blue.100"
            borderRadius="md"
            sx={{
              "& div": {
                transition: "width 1s ease-in-out",
              },
            }}
            value={progress}
          />
        </Box>
      ) : (
        <Box fontSize="2xl">{children}</Box>
      )}
    </Box>
  );
};

const Day = () => {
  const currentEnum = useAppSelector((state) => state.cards.currentEnum);
  const levels = useAppSelector(selectTodayLevel);
  const todoCards = useAppSelector(selectTodoCards);
  const cardsDoneToday = useAppSelector(selectCardsCompletedToday);
  const cardsLeft = todoCards.length;
  const cardsFromToday = cardsLeft + cardsDoneToday.length;
  console.log({ cardsDoneToday, todoCards });
  return (
    <Center h="100%">
      <Box>
        <Stat label="Day">{currentEnum}</Stat>
        <Stat label="Today's Levels">
          {`${levels[0] + 1}, ${levels[1] + 1}`}
        </Stat>
        <Stat
          label="Progress"
          progress={100 - (cardsLeft / cardsFromToday) * 100}
        >
          {`${cardsFromToday - cardsLeft}/${cardsFromToday}`}
        </Stat>
      </Box>
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

const InsightCard: React.FC = ({ children }) => (
  <Card p={2} h="sm">
    {children}
  </Card>
);

export const Insights = () => {
  return (
    <SimpleGrid columns={[1, null, 2, 3]} spacing={6} p={7}>
      <InsightCard>
        <Day />
      </InsightCard>
      <InsightCard>
        <GradCards />
      </InsightCard>
      <InsightCard>
        <Amount />
      </InsightCard>
    </SimpleGrid>
  );
};
