
import React, { useState, useEffect, useRef } from 'react';
import { Gift, RotateCcw, Trophy, Settings2, Trash2 } from 'lucide-react';
import { Employee } from '../types';

interface LuckyDrawProps {
  employees: Employee[];
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ employees }) => {
  const [pool, setPool] = useState<Employee[]>(employees);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentName, setCurrentName] = useState<string | null>(null);
  const [winners, setWinners] = useState<Employee[]>([]);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const spinInterval = useRef<number | null>(null);

  useEffect(() => {
    setPool(employees);
  }, [employees]);

  const startSpin = () => {
    if (pool.length === 0) return;

    setIsSpinning(true);
    let counter = 0;
    const duration = 2000 + Math.random() * 1000;
    const speed = 80;

    spinInterval.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setCurrentName(pool[randomIndex].name);
      counter += speed;

      if (counter >= duration) {
        stopSpin(pool[randomIndex]);
      }
    }, speed);
  };

  const stopSpin = (winner: Employee) => {
    if (spinInterval.current) {
      clearInterval(spinInterval.current);
    }

    setIsSpinning(false);
    setWinners(prev => [winner, ...prev]);

    if (!allowDuplicates) {
      setPool(prev => prev.filter(e => e.id !== winner.id));
    }
  };

  const reset = () => {
    setPool(employees);
    setWinners([]);
    setCurrentName(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
          <div className="bg-indigo-50 p-4 rounded-2xl mb-6">
            <Trophy className="w-12 h-12 text-indigo-600" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">幸運抽獎</h2>
          <p className="text-gray-500 mb-8">
            名單人數: <span className="font-semibold text-indigo-600">{pool.length}</span> 位參與者
          </p>

          <div className="w-full max-w-md bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-10 shadow-2xl relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 w-full h-1 bg-white/20 animate-pulse"></div>
            <div className="h-24 flex items-center justify-center">
              <span className={`text-4xl font-extrabold text-white transition-all ${isSpinning ? 'scale-110 blur-[1px]' : 'scale-100'}`}>
                {currentName || '準備好了嗎？'}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 animate-pulse"></div>
          </div>

          <button
            onClick={startSpin}
            disabled={isSpinning || pool.length === 0}
            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
          >
            {isSpinning ? '抽獎中...' : '開始抽獎！'}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Settings2 size={20} className="text-gray-400" />
              抽獎設定
            </h3>
            <button
              onClick={reset}
              className="text-gray-500 hover:text-indigo-600 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              <RotateCcw size={16} /> 重置抽獎
            </button>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="duplicates"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
            />
            <label htmlFor="duplicates" className="text-gray-700 font-medium cursor-pointer">
              允許重複獲獎 (不從名單移除)
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[700px]">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Gift size={20} className="text-pink-500" />
          獲獎紀錄 ({winners.length})
        </h3>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {winners.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-6 space-y-3">
              <Trophy size={48} className="opacity-10" />
              <p>開始抽獎後，獲獎者會顯示在這裡！</p>
            </div>
          ) : (
            <div className="space-y-3">
              {winners.map((winner, idx) => (
                <div
                  key={`${winner.id}-${idx}`}
                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-xl animate-in slide-in-from-right duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      #{winners.length - idx}
                    </div>
                    <span className="font-semibold text-gray-800">{winner.name}</span>
                  </div>
                  <Gift size={16} className="text-yellow-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
