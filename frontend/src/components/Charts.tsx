import React from 'react';

export const WaterLevelChart: React.FC = () => {
  const dates = ['25 Sep', '26 Sep', '27 Sep', '28 Sep', '29 Sep', '30 Sep', '01 Oct'];
  const values = [73.5, 79.2, 83.1, 85.0, 94.6, 98.4, 101.4]; // rising to ~101m

  // ViewBox: 0 0 500 160
  // Y-range: 60 to 110 (delta = 50)
  // Height: 120 (padding top 20, padding bottom 20)
  const getY = (val: number) => {
    const min = 60;
    const max = 110;
    return 130 - ((val - min) / (max - min)) * 100;
  };

  const getX = (index: number) => {
    return 55 + (index / (dates.length - 1)) * 420;
  };

  const points = values.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
  const areaPoints = `${getX(0)},130 ${points} ${getX(dates.length - 1)},130`;

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
        Water Level (Last 7 Days)
      </div>
      <div style={{ position: 'relative', width: '100%', height: '140px' }}>
        <svg viewBox="0 0 500 155" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          <defs>
            <linearGradient id="waterAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Grid lines & Y-axis labels */}
          {[110, 100, 90, 80, 70, 60].map((level) => {
            const y = getY(level);
            return (
              <g key={level}>
                <line x1="50" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x="42" y={y + 3} textAnchor="end" fontSize="10" fill="#94a3b8" fontFamily="Inter, sans-serif">
                  {level}
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <polygon points={areaPoints} fill="url(#waterAreaGrad)" />

          {/* Line curve */}
          <polyline
            points={points}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {values.map((v, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(v)}
              r="3.5"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}

          {/* X-axis labels */}
          {dates.map((date, i) => (
            <text
              key={date}
              x={getX(i)}
              y="148"
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
              fontFamily="Inter, sans-serif"
            >
              {date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

export const InflowOutflowChart: React.FC = () => {
  const dates = ['25 Sep', '26 Sep', '27 Sep', '28 Sep', '29 Sep', '30 Sep', '01 Oct'];
  const inflow = [4200, 8500, 9100, 9400, 14800, 10500, 9200];
  const outflow = [1200, 3800, 3900, 4100, 5200, 3400, 3100];

  const maxDischarge = 20000;
  const getY = (val: number) => {
    return 130 - (val / maxDischarge) * 105;
  };

  const getX = (index: number) => {
    return 60 + (index / (dates.length - 1)) * 415;
  };

  const inflowPoints = inflow.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');
  const outflowPoints = outflow.map((v, i) => `${getX(i)},${getY(v)}`).join(' ');

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
          Inflow / Outflow
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: '#64748b' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0284c7' }} />
            Inflow
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            Outflow
          </span>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '140px' }}>
        <svg viewBox="0 0 500 155" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
          {/* Y Grid lines */}
          {[20000, 15000, 10000, 5000, 0].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line x1="55" y1={y} x2="480" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x="50" y={y + 3} textAnchor="end" fontSize="9.5" fill="#94a3b8" fontFamily="Inter, sans-serif">
                  {val.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* Inflow Line */}
          <polyline
            points={inflowPoints}
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Outflow Line */}
          <polyline
            points={outflowPoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Inflow Points */}
          {inflow.map((v, i) => (
            <circle
              key={`in-${i}`}
              cx={getX(i)}
              cy={getY(v)}
              r="3.5"
              fill="#0284c7"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}

          {/* Outflow Points */}
          {outflow.map((v, i) => (
            <circle
              key={`out-${i}`}
              cx={getX(i)}
              cy={getY(v)}
              r="3.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          ))}

          {/* X-axis labels */}
          {dates.map((date, i) => (
            <text
              key={date}
              x={getX(i)}
              y="148"
              textAnchor="middle"
              fontSize="10"
              fill="#94a3b8"
              fontFamily="Inter, sans-serif"
            >
              {date}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};
