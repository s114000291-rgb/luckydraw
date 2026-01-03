
import React, { useState, useMemo } from 'react';
import { Users, Gift, ListChecks, Trash2, UserPlus, AlertCircle, UserCheck } from 'lucide-react';
import NameManager from './components/NameManager';
import LuckyDraw from './components/LuckyDraw';
import TeamGenerator from './components/TeamGenerator';
import { Employee, AppTab } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>('names');
  const [employees, setEmployees] = useState<Employee[]>([]);

  const handleUpdateNames = (names: string[]) => {
    const newEmployees = names
      .filter(n => n.trim() !== '')
      .map(name => ({
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim()
      }));
    setEmployees(prev => [...prev, ...newEmployees]);
  };

  const removeEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  };

  const clearAll = () => {
    if (confirm('您確定要清空所有名單嗎？')) {
      setEmployees([]);
    }
  };

  const removeDuplicates = () => {
    const seen = new Set();
    const uniqueEmployees = employees.filter(emp => {
      const normalized = emp.name.trim().toLowerCase();
      const duplicate = seen.has(normalized);
      seen.add(normalized);
      return !duplicate;
    });
    setEmployees(uniqueEmployees);
  };

  const duplicateNames = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach(e => {
      const name = e.name.trim().toLowerCase();
      counts[name] = (counts[name] || 0) + 1;
    });
    return new Set(Object.keys(counts).filter(name => counts[name] > 1));
  }, [employees]);

  const hasDuplicates = duplicateNames.size > 0;

  return (
    <div className="min-h-screen flex flex-col selection:bg-indigo-100">
      <header className="bg-white border-b sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
              <ListChecks size={24} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              HR 魔法工具箱
            </h1>
          </div>

          <nav className="flex space-x-1 bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('names')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${activeTab === 'names' ? 'bg-white shadow-md text-indigo-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              <Users size={18} />
              <span className="font-semibold text-sm">參與者名單</span>
            </button>
            <button
              onClick={() => setActiveTab('draw')}
              disabled={employees.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${employees.length === 0 ? 'opacity-40 grayscale cursor-not-allowed' :
                activeTab === 'draw' ? 'bg-white shadow-md text-indigo-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              <Gift size={18} />
              <span className="font-semibold text-sm">幸運抽獎</span>
            </button>
            <button
              onClick={() => setActiveTab('groups')}
              disabled={employees.length === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${employees.length === 0 ? 'opacity-40 grayscale cursor-not-allowed' :
                activeTab === 'groups' ? 'bg-white shadow-md text-indigo-600 scale-[1.02]' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
            >
              <Users size={18} />
              <span className="font-semibold text-sm">自動分組</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
        {activeTab === 'names' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <NameManager onUpdateNames={handleUpdateNames} hasData={employees.length > 0} />

              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col h-[600px] overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                      名單成員
                      <span className="ml-2 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-black">
                        {employees.length}
                      </span>
                    </h2>
                    {hasDuplicates && (
                      <p className="text-xs font-semibold text-amber-600 flex items-center gap-1 mt-1.5 animate-pulse">
                        <AlertCircle size={12} /> 偵測到重複名單
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {hasDuplicates && (
                      <button
                        onClick={removeDuplicates}
                        className="text-amber-700 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-xs font-bold border border-amber-200 shadow-sm active:scale-95"
                      >
                        <Trash2 size={14} /> 移除重複
                      </button>
                    )}
                    {employees.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="p-2.5 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors border border-transparent hover:border-red-100"
                        title="Clear all members"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2 pb-4">
                  {employees.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                      <div className="bg-gray-50 p-6 rounded-full ring-8 ring-white shadow-inner">
                        <Users size={64} className="opacity-10" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium">名單是空的</p>
                        <p className="text-sm opacity-60">加入一些名字來開始吧！</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2.5">
                      {employees.map((emp) => {
                        const isDuplicate = duplicateNames.has(emp.name.trim().toLowerCase());
                        return (
                          <div
                            key={emp.id}
                            className={`flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${isDuplicate
                              ? 'bg-amber-50 border-2 border-amber-100 shadow-sm scale-[0.98]'
                              : 'bg-gray-50 border-2 border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-md'
                              }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isDuplicate ? 'bg-amber-200 text-amber-700' : 'bg-indigo-100 text-indigo-600'}`}>
                                {emp.name.charAt(0).toUpperCase()}
                              </div>
                              <span className={`font-semibold ${isDuplicate ? 'text-amber-900' : 'text-gray-700'}`}>
                                {emp.name}
                              </span>
                              {isDuplicate && (
                                <span className="text-[10px] px-2 py-0.5 bg-amber-600 text-white rounded-md font-black uppercase tracking-tighter">
                                  DUP
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => removeEmployee(emp.id)}
                              className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'draw' && employees.length > 0 && (
          <LuckyDraw employees={employees} />
        )}

        {activeTab === 'groups' && employees.length > 0 && (
          <TeamGenerator employees={employees} />
        )}
      </main>

      <footer className="bg-white border-t py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="font-semibold text-gray-800">HR 魔法工具箱</p>
            <p>© 2024 現代人資團隊的效率工具。</p>
          </div>
          <div className="flex items-center space-x-6 mt-6 md:mt-0">
            <span className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI 就緒: <strong className="text-indigo-600">Gemini 3 Flash</strong>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
