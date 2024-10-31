import React from "react";
import { Button, ButtonGroup } from "@nextui-org/button";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/dropdown";
import { toast } from "sonner";

import { ChevronDownIcon } from "@/components/icons.tsx";
import { copyHtmlWithStyle } from "@/lib/copy-html.tsx";

export default function CopyButtonGroup() {
  const [selectedOption, setSelectedOption] = React.useState<any>(
    new Set(["email"]),
  );

  const descriptionsMap: any = {
    email: "Then you can paste it to email editor like Gmail.",
    image: "Then you can paste it to every where.",
  };

  const labelsMap: any = {
    email: "Copy as email",
    image: "Copy as image",
  };

  // Convert the Set to an Array and get the first value.
  const selectedOptionValue: any = Array.from(selectedOption)[0];

  const handleCopyButtonClick = () => {
    if (selectedOption.has("email")) {
      copyHtmlWithStyle("markdown-body");
      toast.success(`Content copied`, {
        description: "You can paste into your email",
        duration: 4000,
        position: "top-center",
      });
    }
  };

  return (
    <ButtonGroup variant="flat">
      <Button className="h-[56px]" onClick={handleCopyButtonClick}>
        {labelsMap[selectedOptionValue]}
      </Button>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Button isIconOnly className="h-[56px]">
            <ChevronDownIcon />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          disallowEmptySelection
          aria-label="Merge options"
          className="max-w-[300px]"
          selectedKeys={selectedOption}
          selectionMode="single"
          onSelectionChange={setSelectedOption}
        >
          <DropdownItem key="email" description={descriptionsMap["email"]}>
            {labelsMap["email"]}
          </DropdownItem>
          <DropdownItem key="image" description={descriptionsMap["image"]}>
            {labelsMap["image"]}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </ButtonGroup>
  );
}
