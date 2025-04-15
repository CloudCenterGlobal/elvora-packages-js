"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { usePathname, useRouter } from "next/navigation";
import qs from "qs";

const ApplicationSuccessDialog: React.FC<ApplicationSuccessDialogProps> = ({ application_success }) => {
  const open = application_success === "true";

  const { replace } = useRouter();
  const pathname = usePathname();

  const handleClose = () => {
    // Handle close logic here

    return replace(pathname + qs.stringify({ application_success: "done" }, { addQueryPrefix: true }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Application Successful</DialogTitle>

      <DialogContent dividers>
        <DialogContentText>
          We have received your application. Thank you for applying! Our team is currently reviewing your submission to ensure it meets our requirements. This
          process may take some time, but rest assured, we will get back to you as soon as possible with an update.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export type ApplicationSuccessDialogProps = {
  application_success: "true" | "false" | "done";
};

export { ApplicationSuccessDialog };
