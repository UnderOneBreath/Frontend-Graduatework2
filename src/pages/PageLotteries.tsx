import { useNavigate } from "react-router-dom";
import { LotteryList } from "@/components/lottery-list";
import { Button } from "@/components/ui/button";
import { LotteryStatus } from "@/api/types/lottery.types";

export default function PageLotteries() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Розыгрыши</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Открытые для участия розыгрыши, результаты которых проверяемы.
          </p>
        </div>
        <Button onClick={() => navigate("/lotteries/create")}>
          Создать розыгрыш
        </Button>
      </div>

      <LotteryList
        status={LotteryStatus.Active}
        hideStatus
        emptyText="Сейчас нет активных розыгрышей"
        onLotteryDetails={(id) => navigate(`/lotteries/${id}`)}
      />
    </div>
  );
}
