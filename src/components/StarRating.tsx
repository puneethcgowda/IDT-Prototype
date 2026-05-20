import { Star } from "lucide-react";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
  showValue?: boolean;
}

export default function StarRating({
  value,
  onChange,
  size = 18,
  readOnly = false,
  showValue = false,
}: Props) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.round(value);
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(i)}
            className={readOnly ? "cursor-default" : "cursor-pointer"}
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
          >
            <Star
              width={size}
              height={size}
              className={
                filled ? "fill-yellow-400 stroke-yellow-500" : "stroke-gray-300"
              }
            />
          </button>
        );
      })}
      {showValue && (
        <span className="text-sm text-gray-600 ml-1">{value.toFixed(1)}</span>
      )}
    </div>
  );
}
