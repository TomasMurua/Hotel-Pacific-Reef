"use client";

import * as React from "react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { DayButton, DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  // Default class names for react-day-picker v8
  const defaultClassNames = {
    root: "rdp",
    months: "rdp-months",
    month: "rdp-month",
    nav: "rdp-nav",
    button_previous: "rdp-button_previous",
    button_next: "rdp-button_next",
    month_caption: "rdp-month_caption",
    dropdowns: "rdp-dropdowns",
    dropdown_root: "rdp-dropdown_root",
    dropdown: "rdp-dropdown",
    caption_label: "rdp-caption_label",
    table: "rdp-table",
    weekdays: "rdp-weekdays",
    weekday: "rdp-weekday",
    week: "rdp-week",
    week_number_header: "rdp-week_number_header",
    week_number: "rdp-week_number",
    day: "rdp-day",
    range_start: "rdp-range_start",
    range_middle: "rdp-range_middle",
    range_end: "rdp-range_end",
    today: "rdp-today",
    outside: "rdp-outside",
    disabled: "rdp-disabled",
    hidden: "rdp-hidden",
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-background p-3 rounded-md border", className)}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: "rdp",
        months: "rdp-months",
        month: "rdp-month",
        nav: "rdp-nav",
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-8 w-8 p-0",
          defaultClassNames.button_next
        ),
        month_caption: "rdp-month_caption",
        dropdowns: "rdp-dropdowns",
        dropdown_root: "rdp-dropdown_root",
        dropdown: "rdp-dropdown",
        caption_label: "rdp-caption_label",
        table: "w-full border-collapse",
        weekdays: "rdp-weekdays",
        weekday: "rdp-weekday",
        week: "rdp-week",
        week_number_header: "rdp-week_number_header",
        week_number: "rdp-week_number",
        day: "rdp-day",
        range_start: "rdp-range_start",
        range_middle: "rdp-range_middle",
        range_end: "rdp-range_end",
        today: "rdp-today",
        outside: "rdp-outside",
        disabled: "rdp-disabled",
        hidden: "rdp-hidden",
        ...classNames,
      }}
      components={{
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon
                className={cn("h-4 w-4", className)}
                {...props}
              />
            );
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon
                className={cn("h-4 w-4", className)}
                {...props}
              />
            );
          }

          return (
            <ChevronDownIcon className={cn("h-4 w-4", className)} {...props} />
          );
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus();
  }, [modifiers.focused]);

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "h-8 w-8 p-0 font-normal",
        modifiers.selected &&
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
        modifiers.today &&
          !modifiers.selected &&
          "bg-accent text-accent-foreground",
        modifiers.disabled && "text-muted-foreground opacity-50",
        modifiers.outside && "text-muted-foreground opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
