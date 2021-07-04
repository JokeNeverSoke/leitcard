import { Box, Textarea, Tooltip, Text, useDisclosure } from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";
import React, { useRef } from "react";

export const EditableMarkdown = ({
  value,
  onChange,
  placeholder,
}: {
  onChange: (e: any) => void;
  value: string;
  placeholder: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Box>
      <Textarea
        ref={textareaRef}
        onBlur={onClose}
        value={value}
        onChange={(e) => onChange(e)}
        display={!isOpen ? "none" : undefined}
        placeholder={placeholder}
      />
      <Tooltip label="Click me!" hasArrow placement="left">
        <Text
          tabIndex={0}
          onClick={() => {
            onOpen();
            setTimeout(() => textareaRef.current?.focus());
          }}
          display={isOpen ? "none" : undefined}
          cursor="pointer"
          _hover={{
            textDecoration: "underline",
          }}
        >
          <Markdown>{value || placeholder}</Markdown>
        </Text>
      </Tooltip>
    </Box>
  );
};
