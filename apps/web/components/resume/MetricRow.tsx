interface Metric {
  value: string
  label: string
}

interface MetricRowProps {
  metrics: Metric[]
}

export function MetricRow({ metrics }: MetricRowProps) {
  return (
    <div className="metric-row">
      {metrics.map((metric, index) => (
        <article
          key={metric.label}
          className={`metric-card glass ${index % 2 === 0 ? 'metric-a' : 'metric-b'}`}
        >
          <strong>{metric.value}</strong>
          <span>{metric.label}</span>
        </article>
      ))}
    </div>
  )
}
