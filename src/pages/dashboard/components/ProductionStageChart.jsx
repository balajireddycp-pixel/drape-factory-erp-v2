import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STAGE_COLORS = [
  "hsl(258 45% 55%)",
  "hsl(258 45% 45%)",
  "hsl(28 55% 55%)",
  "hsl(152 40% 40%)",
  "hsl(38 75% 50%)",
  "hsl(6 65% 50%)",
  "hsl(222 15% 55%)",
];

export function ProductionStageChart({ data, loading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Orders by stage</CardTitle>
        <CardDescription>Where every open order currently sits</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-64 w-full" />
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
              <YAxis type="category" dataKey="stage" width={90} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 8, borderColor: "hsl(var(--border))" }} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data?.map((_, i) => <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
