'use client'

interface LoadingDotsProps {
  label?: string
}

export default function LoadingDots({ label }: LoadingDotsProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-8">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`loading-dot w-2.5 h-2.5 bg-indigo-500 rounded-full inline-block`}
          />
        ))}
      </div>
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}
