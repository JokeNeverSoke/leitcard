import {
  Flex,
  Spacer,
  ButtonGroup,
  Tooltip,
  IconButton,
  Popover,
  PopoverTrigger,
  Portal,
  PopoverContent,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  PopoverBody,
  Button,
  Text,
  useBreakpointValue,
  Fade,
} from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";
import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import {
  selectTodayLevel,
  showCardsInLevel,
  useAppDispatch,
  useAppSelector,
} from "../store";
import {
  deleteCard,
  upgradeCard,
  resetCard,
  incrementDate,
} from "../store/cards";
import { Card, CardContent } from "./cards";

export const Left = () => {
  const dispatch = useAppDispatch();
  const levels = useAppSelector(selectTodayLevel);
  const currentEnum = useAppSelector((state) => state.cards.currentEnum);
  const babyCards = useAppSelector(showCardsInLevel(levels[0]));
  const currentCards = useAppSelector(showCardsInLevel(levels[1]));
  const [flipped, setFlipped] = useState(false);
  const allDone = useBreakpointValue({
    base: "Next day",
    md: "Proceed to next day (not recommended)",
  });
  const cards = currentCards
    .concat(babyCards)
    .filter((c) => c.lastEnum < currentEnum);
  const curCard = cards[0];
  if (cards.length) {
    return (
      <ReactCardFlip isFlipped={flipped} infinite>
        <Card key="front">
          <CardContent>{`Level ${curCard.status + 1}`}</CardContent>
          <CardContent
            onClick={() => setFlipped(!flipped)}
            cursor="pointer"
            textAlign="center"
          >
            <Text>
              <Markdown>{curCard.question}</Markdown>
            </Text>
          </CardContent>
        </Card>

        <Card key="back">
          <CardContent
            borderBottom="solid 1px"
            borderColor="gray.200"
            py={2}
            px={5}
          >
            <Flex>
              Answer
              <Spacer />
              <ButtonGroup
                isAttached
                size="xs"
                borderRadius="md"
                overflow="hidden"
                variant="ghost"
              >
                <Tooltip hasArrow label="Not implemented yet">
                  <IconButton
                    icon={<FiEdit />}
                    aria-label="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </Tooltip>
                <Popover>
                  {({ onClose }) => (
                    <>
                      <PopoverTrigger>
                        <IconButton
                          icon={<FiTrash2 />}
                          aria-label="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverHeader>
                            Are you sure you want to delete?
                          </PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Button
                              colorScheme="red"
                              onClick={() => {
                                onClose();
                                dispatch(deleteCard(curCard));
                                setFlipped(false);
                              }}
                            >
                              Delete
                            </Button>
                          </PopoverBody>
                        </PopoverContent>
                      </Portal>
                    </>
                  )}
                </Popover>
              </ButtonGroup>
            </Flex>
          </CardContent>
          <CardContent
            borderBottom="solid 1px"
            borderColor="gray.200"
            py={3}
            px={5}
            textAlign="center"
            onClick={() => setFlipped(!flipped)}
            cursor="pointer"
          >
            <Fade key={curCard.id} in={flipped} transition={{}}>
              <Text>
                <Markdown>{curCard.answer}</Markdown>
              </Text>
            </Fade>
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
            {allDone}
          </Button>
        </Tooltip>
      </Card>
    );
  }
};
