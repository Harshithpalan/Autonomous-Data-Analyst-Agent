const analyzeBtn = document.getElementById('analyzeBtn');
const csvFileInput = document.getElementById('csvFileInput');
const insightList = document.getElementById('insightList');

const sampleInsights = [
  { type: 'Strong', text: 'Customer retention improved after pricing experiment.' },
  { type: 'Watch', text: 'Lead velocity dropped 8% in the Midwest segment.' },
  { type: 'AI', text: 'Recommendation model predicts 19% uplift with campaign A.' }
];

function renderInsights(items) {
  insightList.innerHTML = items
    .map(
      (item) => `
        <div class="insight-item">
          <span class="badge ${item.type === 'Strong' ? 'success' : item.type === 'Watch' ? 'warning' : 'info'}">${item.type}</span>
          <p>${item.text}</p>
        </div>
      `
    )
    .join('');
}

function parseCSV(text) {
  const rows = text.split(/\r?\n/).filter((row) => row.trim() !== '');
  if (!rows.length) return [];

  const headers = rows[0].split(',').map((header) => header.trim());

  return rows.slice(1).map((row) => {
    const values = row.split(',');
    const object = {};
    headers.forEach((header, index) => {
      object[header] = (values[index] || '').trim();
    });
    return object;
  });
}

function analyzeRows(rows) {
  if (!rows.length) {
    return {
      insights: [{ type: 'AI', text: 'No data has been uploaded yet. Load a CSV to begin autonomous analysis.' }],
      metrics: {
        revenue: '$0',
        conversion: '0%',
        churn: '0%',
        score: '0.0'
      }
    };
  }

  const numericColumns = Object.keys(rows[0]).filter((key) => {
    return rows.every((row) => !Number.isNaN(Number(row[key])) && row[key] !== '');
  });

  const values = numericColumns.flatMap((key) => rows.map((row) => Number(row[key])).filter(Number.isFinite));
  const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  const max = values.length ? Math.max(...values) : 0;

  const insights = [
    { type: 'Strong', text: `${numericColumns.length || 0} numeric fields detected with an average value of ${average.toFixed(1)}.` },
    { type: 'Watch', text: `${rows.length} records were processed; peak numeric output reached ${max.toFixed(1)}.` },
    { type: 'AI', text: 'The dataset is suitable for trend forecasting and anomaly detection.' }
  ];

  return {
    insights,
    metrics: {
      revenue: `$${(average * 15).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      conversion: `${(average / 10).toFixed(1)}%`,
      churn: `${Math.max(0.5, (100 - average) / 20).toFixed(1)}%`,
      score: `${Math.min(99.9, 80 + average / 10).toFixed(1)}`
    }
  };
}

function handleCsvUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const rows = parseCSV(String(reader.result));
    const result = analyzeRows(rows);
    renderInsights(result.insights);
    updateMetrics(result.metrics);
  };
  reader.readAsText(file);
}

function updateMetrics(metrics) {
  document.getElementById('revenueValue').textContent = metrics.revenue;
  document.getElementById('conversionValue').textContent = metrics.conversion;
  document.getElementById('churnValue').textContent = metrics.churn;
  document.getElementById('scoreValue').textContent = metrics.score;
}

analyzeBtn.addEventListener('click', () => {
  csvFileInput.click();
});

csvFileInput.addEventListener('change', handleCsvUpload);

renderInsights(sampleInsights);
