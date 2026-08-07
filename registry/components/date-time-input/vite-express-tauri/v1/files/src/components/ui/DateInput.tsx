/**
 * Local registry shim so DateTimeInput can resolve `./DateInput` in the monorepo.
 * Not listed in the install manifest — consumers install `date-input` as a sibling.
 */
export {
  DateInput,
  type DateInputProps,
  type DateInputSize,
  type DateInputValidation,
  type DateInputValue,
} from "../../../../../../../date-input/vite-express-tauri/v1/files/src/components/ui/DateInput";
