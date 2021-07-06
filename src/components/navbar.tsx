import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Input,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { FiSettings } from "react-icons/fi";
import { Config } from "./config";

export const Navbar = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex
      py={3}
      px={5}
      borderRadius={["none", null, "xl"]}
      border={["none", null, "1px"]}
      borderColor={["none", null, "gray.200"]}
      m={[0, null, 5]}
      shadow={["none", null, "lg"]}
    >
      <Center>
        <Heading size="lg">Leitcard</Heading>
      </Center>
      <Spacer />
      <Center>
        <IconButton
          aria-label="Settings"
          colorScheme="blue"
          //   variant="ghost"
          onClick={onOpen}
          borderRadius="lg"
          icon={<FiSettings />}
        />
      </Center>

      <Drawer isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Settings</DrawerHeader>

          <DrawerBody>
            <Config />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
