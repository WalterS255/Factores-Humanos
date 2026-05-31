import { Link } from 'react-router-dom'

export default function PlaceholderCard({ title, description, actions = [] }) {
  return (
    <div className="max-w-md w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-white font-semibold"
          >
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
