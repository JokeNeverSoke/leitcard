import React from "react";
import { Box } from "@chakra-ui/react";

export const Card = (props: React.ComponentProps<typeof Box>) => {
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

export const CardContent = (props: React.ComponentProps<typeof Box>) => {
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
