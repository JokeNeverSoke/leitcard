import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { EditableMarkdown } from "./editableMarkdown";

interface EditModalProps {
  card: Card;
  onSubmit: (card: Card) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const EditModal = ({
  card: propCard,
  isOpen,
  onClose,
  onSubmit,
}: EditModalProps) => {
  const [isAnswerFocus, setIsAnswerFocus] = useState(false);
  const [card, setCard] = useState(propCard);
  const { question, answer } = card;
  useEffect(() => {
    setCard(propCard);
  }, [propCard.id]);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Card</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <EditableMarkdown
            value={question}
            onChange={(e) => {
              setCard({ ...card, question: e.target.value });
            }}
            label="Question"
            onSubmit={() => {
              setIsAnswerFocus(true);
            }}
          />
          <EditableMarkdown
            value={answer}
            onChange={(e) => {
              setCard({ ...card, answer: e.target.value });
            }}
            label="Answer"
            isFocused={isAnswerFocus}
            onOpen={() => setIsAnswerFocus(true)}
            onClose={() => setIsAnswerFocus(false)}
            onSubmit={() => {
              onSubmit(card);
            }}
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => {
              onSubmit(card);
            }}
          >
            Edit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
