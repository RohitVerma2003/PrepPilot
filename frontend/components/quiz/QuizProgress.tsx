interface QuizProgressProps {
  current: number;
  total: number;
}

export default function QuizProgress({ current, total }: QuizProgressProps) {
  return (
    <div className="border border-gray-800 rounded-lg bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-300">
          Question {current} of {total}
        </span>
        <div className="flex gap-1">
          {[...Array(total)].map((_, i) => (
            <div
              key={i}
              className={`w-8 h-1 rounded-full ${
                i < current ? "bg-green-600" : "bg-gray-700"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
