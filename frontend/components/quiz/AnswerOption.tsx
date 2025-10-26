"use client";

interface AnswerOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

export default function AnswerOption({
  option,
  index,
  isSelected,
  isDisabled,
  onSelect,
}: AnswerOptionProps) {
  return (
    <button
      onClick={onSelect}
      disabled={isDisabled}
      className={`w-full text-left px-4 py-3 rounded-md border transition-all ${
        isSelected
          ? "border-blue-600 bg-blue-950 text-blue-100"
          : "border-gray-700 bg-gray-950 hover:border-gray-600 hover:bg-gray-800"
      } disabled:cursor-not-allowed`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-semibold mt-0.5 ${
            isSelected
              ? "border-blue-500 bg-blue-500 text-white"
              : "border-gray-600 text-gray-400"
          }`}
        >
          {String.fromCharCode(65 + index)}
        </span>
        <span className="flex-1 text-sm">{option}</span>
      </div>
    </button>
  );
}
