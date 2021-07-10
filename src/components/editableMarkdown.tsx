import {
  Box,
  Textarea,
  Tooltip,
  Text,
  useDisclosure,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";
import React, { useRef, useEffect } from "react";

export const EditableMarkdown = ({
  value,
  onChange,
  label,
  onSubmit,
  isFocused,
  onOpen: onO,
  onClose: onC,
}: {
  onChange: (e: any) => void;
  value: string;
  label: string;
  onSubmit?: () => void;
  isFocused?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    isOpen: isFocused,
    onOpen: onO,
    onClose: onC,
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commonStyleProps = {
    px: 2,
    py: 0.5,
    background: "gray.50",
    borderRadius: "md",
    transition: '0.3s ease-in-out'
  };
  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <FormControl pb={3}>
      {label && (
        <FormLabel fontSize="xs" color="gray.500" mb={0} ml={0.5}>
          {label}
        </FormLabel>
      )}
      <Textarea
        ref={textareaRef}
        onBlur={onClose}
        onFocus={onOpen}
        value={value}
        onChange={(e) => onChange(e)}
        rows={2}
        display={!isOpen && value ? "none" : undefined}
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            textareaRef.current?.blur();
            onSubmit && onSubmit();
          }
        }}
        {...commonStyleProps}
      />
      <Text
        tabIndex={0}
        onClick={() => {
          onOpen();
        }}
        {...commonStyleProps}
        display={isOpen || !value ? "none" : undefined}
        cursor="pointer"
        _hover={{
          textDecoration: "underline",
          background: "gray.100",
        }}
        as="div"
      >
        <Markdown>{value || ""}</Markdown>
      </Text>
    </FormControl>
  );
};
