import { deleteOil } from "@services/oilRequests";
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

const DeleteOilModal = ({
  open,
  setOpen,
  isDarkMode,
  updateOils,
  selectedOil,
}) => {
  const { t } = useTranslation(); // Hook para traducciones

  const handleDelete = async () => {
    try {
      const result = await deleteOil(selectedOil.id);

      if (result.status === "success") {
        success({
          title: t("oils.successDeleteTitle"), 
          text: t("oils.successDeleteText"), 
          delay: 2000,
        });
        setOpen(false);

        if (updateOils) {
          updateOils();
        }
      } else {
        error({
          title: t("oils.errorDeleteTitle"),
          text: result.message,
          delay: 2000,
        });
      }
    } catch (err) {
      error({
        title: t("common.error"),
        text: t("oils.errorDeleteText"), 
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
            {selectedOil
              ? t("oils.deleteOilTitle", {
                  name: selectedOil.name,
                }) 
              : t("oils.loadingOil")}
          </DialogTitle>
          <DialogDescription>
            {selectedOil
              ? t("oils.deleteOilDescription") 
              : t("users.loadingUserDescription")}
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
            className={clsx(
              "py-2 font-semibold rounded-md focus:outline-none focus:ring-2 cursor-pointer bg-red-700 text-white hover:bg-red-500"
            )}
          >
            {t("oils.deleteOil")} 
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteOilModal;