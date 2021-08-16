import {
  Button,
  ButtonGroup,
  Center,
  Checkbox,
  Flex,
  IconButton,
  Text,
  StackDivider,
  Tooltip,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { FiHelpCircle } from "react-icons/fi";
import { addBackup } from "../services/storage";
import { useAppDispatch, useAppSelector } from "../store";
import { setPref } from "../store/cards";
import { Transfer } from "./transfer";

export const Config = () => {
  const dispatch = useAppDispatch();
  const pref = useAppSelector((state) => state.cards.preference);

  return (
    <VStack spacing={2} align="left">
      <Checkbox
        isChecked={pref.autoSave}
        onChange={(e) => {
          dispatch(setPref("autoSave", e.target.checked));
        }}
      >
        Autosave
      </Checkbox>
      <Checkbox
        isChecked={pref.finishAllFirstLevel}
        onChange={(e) => {
          dispatch(setPref("finishAllFirstLevel", e.target.checked));
        }}
      >
        At least level 2
        <Tooltip
          maxW="2xs"
          textAlign="center"
          label="Repeat level 1 cards until they progress to level 2"
        >
          <IconButton
            aria-label="description"
            top={-0.5}
            ml={1}
            size="xz"
            borderRadius="full"
            icon={<FiHelpCircle />}
            variant="ghost"
            colorScheme="yellow"
            onClick={(e) => e.preventDefault()}
          />
        </Tooltip>
      </Checkbox>
      <Transfer />
      {!process.env.VITE_VERCEL_ENV ? null : (
        <Text color="gray.500">
          {process.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 8)} -{" "}
          {process.env.VITE_VERCEL_GIT_COMMIT_MESSAGE}
        </Text>
      )}
    </VStack>
  );
};
