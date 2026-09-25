import { AlertTriangle } from "lucide-react";
import { Card } from "../../components/Card";
import { BarTrend } from "../../components/charts/BarTrend";
import { DonutStat } from "../../components/charts/DonutStat";
import { RadarStat } from "../../components/charts/RadarStat";
import { AreaCompare } from "../../components/charts/AreaCompare";
import { useDatabase } from "../../lib/store";
import { formatStock, isBelowThreshold } from "../../lib/format";
import { consumptionShare, locationComparison, monthlyOutboundTrend, yearlyTrend } from "../../lib/mockData";

export function Dashboard() {
  const db = useDatabase();
  const lowStock = db.items.filter(isBelowThreshold);

  const totalUnits = db.items.reduce((sum, i) => sum + i.stockBoxes * i.unitsPerBox + i.stockUnits, 0);
  const stockRatio = db.items.map((i) => ({
    name: i.name,
    value: Math.round(((i.stockBoxes * i.unitsPerBox + i.stockUnits) / (totalUnits || 1)) * 100),
  }));

  const radarData = db.items.map((i) => ({
    axis: i.name,
    value: Math.min(100, Math.round((i.stockBoxes / Math.max(1, i.thresholdBoxes)) * 40)),
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-extrabold text-ink">재고 대시보드</h1>
        <span className="text-xs font-mono text-faint">{new Date().toLocaleDateString("ko-KR")} 기준</span>
      </div>

      {lowStock.length > 0 && (
        <div className="rounded-2xl border border-critical-soft bg-critical-soft/60 px-4 py-3 flex items-start gap-3">
          <AlertTriangle size={18} className="text-critical shrink-0 mt-0.5" />
          <div className="text-sm text-ink">
            <span className="font-bold text-critical">재고 부족 경고 · </span>
            {lowStock.map((i) => i.name).join(", ")} 품목이 설정된 경고 기준({" "}
            {lowStock.map((i) => `${i.thresholdBoxes}박스`).join(", ")}) 이하입니다.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card eyebrow="기저귀 · 물티슈" title="재고 현황" className="md:col-span-1 md:row-span-2">
          <ul className="space-y-3 mt-1">
            {db.items.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink font-medium flex-1 min-w-0 leading-snug">{i.name}</span>
                <span className={"text-sm font-mono tabular shrink-0 whitespace-nowrap text-right " + (isBelowThreshold(i) ? "text-critical font-bold" : "text-muted")}>
                  {formatStock(i)}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <Card eyebrow="최근 6개월" title="반출 추이" right={<span className="text-lg font-extrabold text-ink tabular">{monthlyOutboundTrend[monthlyOutboundTrend.length - 1]?.value}개</span>} className="md:col-span-2">
          <BarTrend data={monthlyOutboundTrend} dataKey="value" labelKey="month" suffix="개" />
        </Card>

        <Card eyebrow="기준 대비 여유분" title="품목별 재고 여유도" className="md:col-span-1">
          <RadarStat data={radarData} />
        </Card>

        <Card eyebrow="전체 품목" title="재고 구성 비율" className="md:col-span-2">
          <DonutStat data={stockRatio} centerLabel="재고" centerValue={`${db.items.length}종`} />
        </Card>

        <Card eyebrow="이번 달" title="품목별 소비 비중" className="md:col-span-2">
          <DonutStat data={consumptionShare} centerLabel="이번 달" centerValue="반출" />
        </Card>

        <Card eyebrow="최근 6개월" title="B동 · C동 반출 비교" className="md:col-span-2">
          <div className="flex items-center gap-4 mb-1 text-xs">
            <span className="flex items-center gap-1.5 text-muted"><span className="w-2 h-2 rounded-full bg-accent" />B동</span>
            <span className="flex items-center gap-1.5 text-muted"><span className="w-2 h-2 rounded-full bg-accent2" />C동</span>
          </div>
          <AreaCompare data={locationComparison} />
        </Card>

        <Card eyebrow="누적 추이" title="연간 반출량 추이" className="md:col-span-2">
          <BarTrend data={yearlyTrend} dataKey="value" labelKey="year" suffix="개" highlightLast={false} />
        </Card>
      </div>
    </div>
  );
}
