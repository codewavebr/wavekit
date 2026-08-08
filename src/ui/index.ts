"use client";

/**
 * WaveKit UI is built on HeroUI v3.
 * Primitives are re-exported; composites live in sibling modules.
 */
export {
  Accordion,
  Alert,
  AlertDialog,
  Autocomplete,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardRoot,
  CardTitle,
  Checkbox,
  CheckboxGroup,
  Chip,
  CloseButton,
  DateField,
  DatePicker,
  DateRangePicker,
  Description,
  Disclosure,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownRoot,
  DropdownSection,
  DropdownTrigger,
  EmptyState,
  ErrorMessage,
  FieldError,
  Fieldset,
  Form as HeroForm,
  Header,
  Input,
  InputGroup,
  InputOTP,
  Label,
  Link,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalRoot,
  ModalTrigger,
  NumberField,
  Pagination,
  Popover,
  ProgressBar,
  ProgressCircle,
  Radio,
  RadioGroup,
  RangeCalendar,
  ScrollShadow,
  SearchField,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Surface,
  Switch,
  SwitchGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableContent,
  TableHeader,
  TableRoot,
  TableRow,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TextArea,
  TextField,
  TimeField,
  ToggleButton,
  Tooltip,
  Typography,
  useOverlayState,
  useTheme,
  AvatarFallback,
  AvatarImage,
} from "@heroui/react";

export type {
  ButtonProps,
  CardProps,
  InputProps,
  ModalProps,
  TabsProps,
} from "@heroui/react";

/** Aliases for familiar WaveKit / shadcn-era names */
export { ProgressBar as Progress } from "@heroui/react";
export { Drawer as Sheet } from "@heroui/react";
export { ScrollShadow as ScrollArea } from "@heroui/react";
export { TimeField as TimeInput } from "@heroui/react";
export { Modal as Dialog } from "@heroui/react";
export { TextArea as Textarea } from "@heroui/react";

export { PasswordInput, type PasswordInputProps } from "./password-input";
export { ConfirmDialog, type ConfirmDialogProps } from "./confirm-dialog";
export { UploadWithDialog, type UploadWithDialogProps } from "./upload-dialog";
export { AvatarGroup, type AvatarGroupProps } from "./avatar-group";
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";
export { Toaster, toast, Toast } from "./toaster";
export {
  SingleDayPicker,
  type SingleDayPickerProps,
} from "./single-day-picker";
