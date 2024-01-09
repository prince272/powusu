import { ConfirmAccountModal } from "./identity/confirm-account-modal";
import { ResetPasswordModal } from "./identity/reset-password";
import { SignInModal } from "./identity/sign-in-modal";
import { SignUpModal } from "./identity/sign-up-modal";

export const modals = {
  "sign-in": SignInModal,
  "sign-up": SignUpModal,
  "confirm-account": ConfirmAccountModal,
  "reset-password": ResetPasswordModal
};
