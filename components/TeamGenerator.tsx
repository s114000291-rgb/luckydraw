
import React, { useState } from 'react';
import { Users, Shuffle, Sparkles, Download, LayoutGrid, FileDown } from 'lucide-react';
import { Employee, Team } from '../types';
import { generateTeamIdentities } from '../services/geminiService';

interface TeamGeneratorProps {
  employees: Employee[];
}

const TeamGenerator: React.FC<TeamGeneratorProps> = ({ employees }) => {
  const [groupSize, setGroupSize] = useState(3);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const generateGroups = () => {
    setIsGenerating(true);

    // Shuffle
    const shuffled = [...employees].sort(() => Math.random() - 0.5);
    const newTeams: Team[] = [];

    for (let i = 0; i < shuffled.length; i += groupSize) {
      const groupMembers = shuffled.slice(i, i + groupSize);
      newTeams.push({
        id: Math.random().toString(36).substr(2, 9),
        name: `第 ${newTeams.length + 1} 組`,
        members: groupMembers
      });
    }

    setTeams(newTeams);
    setIsGenerating(false);
  };

  const enhanceWithAI = async () => {
    if (teams.length === 0) return;
    setIsEnhancing(true);

    const identities = await generateTeamIdentities(teams.length);

    setTeams(prev => prev.map((team, idx) => ({
      ...team,
      name: identities[idx]?.name || team.name,
      icebreaker: identities[idx]?.icebreaker || "在工作中最棒的部分是什麼？"
    })));

    setIsEnhancing(false);
  };

  const downloadCSV = () => {
    if (teams.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,Team Name,Member Name,Icebreaker\n";

    teams.forEach(team => {
      team.members.forEach(member => {
        const row = [
          `"${team.name}"`,
          `"${member.name}"`,
          `"${team.icebreaker || 'N/A'}"`
        ].join(",");
        csvContent += row + "\n";
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `grouping_result_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-800">自動分組</h2>
            <p className="text-gray-500">將參與者有效率地分組。</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
              <Users size={18} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-600">每組人數:</span>
              <input
                type="number"
                min="2"
                max={employees.length}
                value={groupSize}
                onChange={(e) => setGroupSize(parseInt(e.target.value) || 2)}
                className="w-12 bg-transparent border-none focus:ring-0 text-indigo-600 font-bold outline-none"
              />
            </div>

            <button
              onClick={generateGroups}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
            >
              <Shuffle size={18} /> {teams.length > 0 ? '重新分組' : '產生分組'}
            </button>

            {teams.length > 0 && (
              <>
                <button
                  onClick={enhanceWithAI}
                  disabled={isEnhancing}
                  className="flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <Sparkles size={18} className={isEnhancing ? 'animate-spin' : ''} />
                  {isEnhancing ? '思考中...' : 'AI 命名'}
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all shadow-md active:scale-95"
                >
                  <FileDown size={18} /> 匯出 CSV
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {teams.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-20 flex flex-col items-center justify-center text-gray-400 text-center">
          <LayoutGrid size={64} className="mb-4 opacity-10" />
          <h3 className="text-xl font-medium mb-2">準備好分組了嗎？</h3>
          <p>選擇每組人數並點擊產生分組。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, idx) => (
            <div
              key={team.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-300"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
                <h3 className="text-white font-bold text-lg truncate">{team.name}</h3>
                <p className="text-indigo-100 text-xs uppercase tracking-wider font-medium">
                  {team.members.length} 位成員
                </p>
              </div>

              <div className="p-6 flex-1 space-y-4">
                <div className="space-y-2">
                  {team.members.map(member => (
                    <div key={member.id} className="flex items-center gap-2 py-1 border-b border-gray-50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      <span className="text-gray-700">{member.name}</span>
                    </div>
                  ))}
                </div>

                {team.icebreaker && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-xs uppercase mb-1">
                      <Sparkles size={12} /> 團隊破冰問題
                    </div>
                    <p className="text-sm text-amber-800 italic">"{team.icebreaker}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamGenerator;
