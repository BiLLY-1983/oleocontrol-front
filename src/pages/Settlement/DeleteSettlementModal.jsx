import { deleteSettlement } from "@services/settlementRequests";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@components/ui/dialog";
import { Button } from "@components/ui/button";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/confirm/dist/PNotifyConfirm.css";

const DeleteSettlementModal = ({
  open,
  setOpen,
  isDarkMode,
  updateSettlements,
  selectedSettlement,
}) => {
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      const result = await deleteSettlement(selectedSettlement.id);

      if (result.status === "success") {
        success({
          title: t("settlements.successDeleteTitle"),
          text: t("settlements.successDeleteText"),
          delay: 2000,
        });
        setOpen(false);

        if (updateSettlements) {
          updateSettlements();
        }
      } else {
        error({
          title: t("settlements.errorDeleteTitle"),
          text: result.message,
          delay: 2000,
        });
      }
    } catch (err) {
      error({
        title: t("common.error"),
        text: t("settlements.errorDeleteText"),
        delay: 2000,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={clsx(
          isDarkMode
            ? "accent-dark-400 bg-dark-700 border-dark-600 text-dark-50"
            : "accent-olive-600 bg-olive-50 border-gray-300 text-olive-800"
        )}
      >
        <DialogHeader>
          <DialogTitle>
            {selectedSettlement
              ? t("settlements.deleteSettlement")
              : t("settlements.loadingSettlement")}
          </DialogTitle>
          <DialogDescription>
            {selectedSettlement
              ? t("settlements.deleteSettlementDescription")
              : t("settlements.loadingSettlementDescription")}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="py-2 font-semibold rounded-md cursor-pointer"
            >
              {t("common.cancel")}
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer bg-red-700 text-white hover:bg-red-500"
          >
            {t("settlements.deleteSettlement")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSettlementModal;
