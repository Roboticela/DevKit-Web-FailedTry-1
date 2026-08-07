/**
 * Local registry shim so CheckboxGroup can resolve `./Checkbox` in the monorepo.
 */
export {
  Checkbox,
  type CheckboxProps,
  type CheckboxSize,
  type CheckboxValidation,
} from "../../../../../../../checkbox/vite-express-tauri/v1/files/src/components/ui/Checkbox";
