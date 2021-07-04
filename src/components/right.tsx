import {
  Box,
  Button,
  Heading,
  Switch,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useAppDispatch } from "../store";
import { addCard } from "../store/cards";
import { Card, CardContent } from "./cards";
import { EditableMarkdown } from "./editableMarkdown";

export const Right = () => {
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
          leftIcon={<FiPlus />}
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
