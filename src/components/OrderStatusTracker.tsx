import { useTranslation } from "react-i18next";
import {
  Wallet,
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import type { Order } from "../types";

const ORDER_FLOW: Order["status"][] = ["paid", "packed", "shipped", "delivered"];

interface Props {
  status: Order["status"];
  onAdvance?: (next: Order["status"]) => void;
  onCancel?: () => void;
  canAdvance?: boolean;
  compact?: boolean;
}

export default function OrderStatusTracker({
  status,
  onAdvance,
  onCancel,
  canAdvance,
  compact = false,
}: Props) {
  const { t } = useTranslation();

  if (status === "cancelled") {
    return (
      <div className="rounded-lg bg-red-50 border border-red-100 px-3 py-2 flex items-center gap-2 text-sm text-red-700">
        <XCircle className="w-4 h-4" />
        <span className="font-medium">{t("order.cancelled")}</span>
      </div>
    );
  }

  const currentIdx = ORDER_FLOW.indexOf(status);
  const nextStatus = ORDER_FLOW[currentIdx + 1];

  const steps = [
    { key: "paid", label: t("order.paid"), Icon: Wallet },
    { key: "packed", label: t("order.packed"), Icon: Package },
    { key: "shipped", label: t("order.shipped"), Icon: Truck },
    { key: "delivered", label: t("order.delivered"), Icon: CheckCircle2 },
  ];

  return (
    <div className={compact ? "" : "rounded-lg bg-gray-50 border border-gray-100 p-3"}>
      <div className="flex items-center gap-1 sm:gap-2">
        {steps.map((s, i) => {
          const reached = i <= currentIdx;
          const current = i === currentIdx;
          return (
            <div key={s.key} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center min-w-0 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    reached
                      ? current
                        ? "bg-brand-600 text-white ring-4 ring-brand-100"
                        : "bg-brand-600 text-white"
                      : "bg-white border-2 border-gray-200 text-gray-400"
                  }`}
                >
                  <s.Icon className="w-4 h-4" />
                </div>
                <div
                  className={`mt-1 text-[10px] sm:text-xs font-medium text-center truncate w-full ${
                    reached ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-1 mb-4 ${
                    i < currentIdx ? "bg-brand-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {!compact && canAdvance && nextStatus && (
        <div className="mt-3 flex flex-wrap gap-2 justify-end">
          {onCancel && status === "paid" && (
            <button onClick={onCancel} className="btn-ghost text-xs text-red-600 hover:bg-red-50">
              <XCircle className="w-3.5 h-3.5" /> Cancel
            </button>
          )}
          {onAdvance && (
            <button
              onClick={() => onAdvance(nextStatus)}
              className="btn-primary text-xs px-3 py-1.5"
            >
              {t("order.advanceStatus", { next: t(`order.${nextStatus}`) })}
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
