import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@nextui-org/dropdown";
import { Button } from "@nextui-org/button";
import { useTranslation } from "react-i18next";
import { LangIcon } from "@/components/icons.tsx";

const LangSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly={true} variant="light">
          <LangIcon />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Static Actions"
        disallowEmptySelection
        // selectionMode="single"
        onAction={(lang) => {
          changeLanguage(lang as string);
        }}
      >
        <DropdownItem key="zh">中文</DropdownItem>
        <DropdownItem key="en">English</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default LangSwitcher;
