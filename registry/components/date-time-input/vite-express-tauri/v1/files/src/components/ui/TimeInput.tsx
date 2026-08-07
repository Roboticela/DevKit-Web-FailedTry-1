/**
 * Local registry shim so DateTimeInput can resolve `./TimeInput` in the monorepo.
 * Not listed in the install manifest — consumers install `time-input` as a sibling.
 */
export {
  TimeInput,
  type TimeInputProps,
  type TimeInputSize,
  type TimeInputValidation,
  type TimeInputHourCycle,
  type TimeInputValue,
} from "../../../../../../../time-input/vite-express-tauri/v1/files/src/components/ui/TimeInput";
