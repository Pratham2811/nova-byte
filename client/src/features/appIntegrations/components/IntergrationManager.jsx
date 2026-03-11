import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Blocks,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
  LogOut,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  connectGoogleDrive,
  getIntegrationsInfo,
} from "../slice/integrationThunk";

// Authentic Google Drive SVG Icon
const DriveIcon = ({ className }) => (
  <svg
    viewBox="0 0 87.3 78"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M26.6 76.5L6.6 41.8 24 11.6l20 34.7z" fill="#0066DA" />
    <path d="M60.7 76.5H20.7l20-34.7h40z" fill="#00AC47" />
    <path d="M80.7 41.8L60.7 7.1H20.7l20 34.7z" fill="#EA4335" />
    <path d="M26.6 76.5l20-34.7L66.7 7.1 46.7 41.8z" fill="#FFBA00" />
  </svg>
);

export const IntegrationsManager = () => {
  const dispatch = useDispatch();


  const providers = useSelector(
    (state) => state.integratedApps.providers || {},
  );

  // Extract Google Drive specific info
  const driveData = providers["google-drive"];

  const isDriveConnected = driveData?.state === "connected";
  const connectedEmail = driveData?.email;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpeningPopup, setIsOpeningPopup] = useState(false);

  const handleConnectDrive = async () => {
    setIsOpeningPopup(true);
    try {
      const response = await dispatch(connectGoogleDrive()).unwrap();

      const popup = window.open(
        response.authUrl,
        "googledriveConnectionConsentPopup",
        "left=100,top=100,width=500,height=600",
      );

      if (!popup) {
        toast.error("Popup blocked! Please allow popups for this site.");
      }
      window.addEventListener("message", (event) => {
        if (event.data.type === "GOOGLE_DRIVE_CONNECTED") {
          dispatch(getIntegrationsInfo());
        }
        if (event.data.type ==="ERROR_CONNECTING_DRIVE") {
          dispatch(getIntegrationsInfo());
        }

      });
    } catch (error) {
      toast.error(
        error?.message || error || "Failed to initialize Drive connection",
      );
    } finally {
      setIsOpeningPopup(false);
    }
  };

  return (
    <>
      {/* --- Sidebar Trigger Button --- */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full group flex items-center justify-between px-3 py-2 rounded-md transition-all duration-200 hover:bg-slate-100 border border-transparent hover:border-slate-200"
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-white rounded-md shadow-sm border border-slate-200 flex-shrink-0 group-hover:scale-105 transition-transform text-slate-500 group-hover:text-indigo-600">
            <Blocks className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900">
            Integrations
          </span>
        </div>
        <ArrowRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200" />
      </button>

      {/* --- Integrations Hub Dialog --- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px] bg-white p-0 gap-0 overflow-hidden shadow-2xl border-slate-100">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 bg-slate-50/50">
            <DialogTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
              <Blocks className="w-5 h-5 text-indigo-500" />
              Connected Apps
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Manage your third-party integrations to seamlessly import memories
              into CloudMemories.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-white">
            {/* --- App Row: Google Drive --- */}
            <div
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border transition-all duration-200",
                isDriveConnected
                  ? "border-emerald-100 bg-emerald-50/30"
                  : "border-slate-200 hover:border-indigo-200 hover:shadow-md",
              )}
            >
              {/* App Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 shrink-0">
                  <DriveIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Google Drive
                  </h4>
                  {isDriveConnected && connectedEmail ? (
                    <p className="text-xs font-medium text-emerald-600 mt-0.5">
                      Connected as {connectedEmail}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 mt-0.5">
                      Import photos & videos directly.
                    </p>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pl-4 shrink-0">
                {isDriveConnected ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold select-none">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </div>
                ) : (
                  <Button
                    onClick={handleConnectDrive}
                    disabled={
                      isOpeningPopup || driveData?.state === "connecting"
                    }
                    variant="outline"
                    className="h-9 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200"
                  >
                    {isOpeningPopup || driveData?.state === "connecting" ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-1.5 text-slate-400" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IntegrationsManager;
