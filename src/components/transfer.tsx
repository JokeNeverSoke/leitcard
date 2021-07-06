import {
  ButtonGroup,
  Button,
  useClipboard,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Alert,
  AlertIcon,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { exportCurrent, importCurrent } from "../db";

export const Transfer = () => {
  const toast = useToast();
  const [isLoad, setIsLoad] = useState(false);
  const [saveString, setSaveString] = useState("loading");
  const [shouldCopy, setShouldCopy] = useState(0);
  const [code, setCode] = useState("");
  const { onCopy } = useClipboard(saveString);
  useEffect(() => {
    if (shouldCopy === 0) return;
    toast({ title: "Copied to clipboard!", status: "success" });
    onCopy();
  }, [shouldCopy]);

  return (
    <>
      <Modal isOpen={isLoad} onClose={() => setIsLoad(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Import Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert mb={2} status="error" borderRadius="md">
              <AlertIcon />
              This action will overwrite all local data!
            </Alert>
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="paste code here"
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="orange"
              mr={3}
              onClick={() => {
                importCurrent(code);
              }}
            >
              Submit
            </Button>
            <Button variant="ghost" onClick={() => setIsLoad(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <ButtonGroup>
        <Button colorScheme="blue" onClick={() => setIsLoad(true)}>
          Load
        </Button>
        <Button
          onClick={() => {
            exportCurrent().then((s) => {
              setSaveString(s);
              setShouldCopy((s) => s + 1);
            });
          }}
        >
          Save
        </Button>
      </ButtonGroup>
    </>
  );
};
