import { Checkbox, Tooltip, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { setPref } from "../store/cards";

export const Config = () => {
  const dispatch = useAppDispatch();
  const pref = useAppSelector((state) => state.cards.preference);

  return (
    <>
      <Checkbox
        checked={pref.finishAllFirstLevel}
        onChange={(e) => {
          dispatch(setPref("finishAllFirstLevel", e.target.checked));
        }}
      >
        <Tooltip label="Repeat level 1 cards until they progress to level 2">
          At least level 2
        </Tooltip>
      </Checkbox>
    </>
  );
};
