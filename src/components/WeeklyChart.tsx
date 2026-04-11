import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

interface WeeklyChartProps {
  memorizedPages: { page: number; date: string }[];
}

export default function WeeklyChart({ memorizedPages }: WeeklyChartProps) {
  const data = useMemo(() => {
    const days: { name: string; date: string; pages: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const dayName = d.toLocaleDateString("en", { weekday: "short" });
      const count = memorizedPages.filter((p) => p.date === dateStr).length;
      days.push({ name: dayName, date: dateStr, pages: count });
    }
    return days;
  }, [memorizedPages]);

  const maxPages = Math.max(...data.map((d) => d.pages), 1);

  return (
    <div className="w-full h-40">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="25%">
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: "hsl(240 10% 45%)" }}
          />
          <YAxis hide domain={[0, maxPages + 1]} />
          <Tooltip
            contentStyle={{
              background: "hsla(0,0%,100%,0.9)",
              border: "1px solid hsl(240 15% 85%)",
              borderRadius: "12px",
              fontSize: "12px",
              boxShadow: "0 4px 12px hsla(0,0%,0%,0.08)",
            }}
            formatter={(value: number) => [`${value} pages`, "Added"]}
            labelFormatter={(label) => label}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(252 60% 58%)" stopOpacity={0.9} />
              <stop offset="100%" stopColor="hsl(210 80% 60%)" stopOpacity={0.7} />
            </linearGradient>
          </defs>
          <Bar dataKey="pages" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
