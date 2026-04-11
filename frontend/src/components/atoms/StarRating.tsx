import React from "react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "text-sm", md: "text-lg", lg: "text-2xl" };

export function StarRating({ value, max = 5, size = "md" }: StarRatingProps) {
  return (
    <span className={`flex gap-0.5 ${sizes[size]}`} aria-label={`${value} de ${max} estrelas`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          <span key={i} className={filled ? "text-yellow-400" : half ? "text-yellow-300" : "text-gray-300"}>
            ★
          </span>
        );
      })}
    </span>
  );
}
