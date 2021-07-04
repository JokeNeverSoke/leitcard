import {
  Center,
  color,
  Heading,
  SimpleGrid,
  textDecoration,
  useTheme,
  Box,
} from "@chakra-ui/react";
import React from "react";
import { VictoryAxis, VictoryBar, VictoryChart, VictoryLabel } from "victory";
import { selectAllLevels, useAppSelector } from "../store";
import { getStatus } from "../utils/findStatuses";
import { Card } from "./cards";

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

export const Insights = () => {
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
