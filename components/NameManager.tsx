
import React, { useState } from 'react';
import { Upload, ClipboardList, Info, UserPlus, Sparkles } from 'lucide-react';

interface NameManagerProps {
  onUpdateNames: (names: string[]) => void;
  hasData: boolean;
}

const SAMPLE_DATA = [
  "陳小明", "林美華", "張志強", "李淑芬",
  "王大軍", "吳雅婷", "劉冠宇", "蔡欣怡",
  "楊宗翰", "許家豪", "黃怡君", "謝佳穎"
];

const NameManager: React.FC<NameManagerProps> = ({ onUpdateNames, hasData }) => {
  const [inputText, setInputText] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const names = content
        .split(/[\n,]/)
        .map(n => n.trim())
        .filter(n => n !== '');
      onUpdateNames(names);
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = () => {
    const names = inputText
      .split(/[\n,]/)
      .map(n => n.trim())
      .filter(n => n !== '');
    if (names.length > 0) {
      onUpdateNames(names);
      setInputText('');
    }
  };

  const loadSample = () => {
    onUpdateNames(SAMPLE_DATA);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-indigo-600">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <ClipboardList size={22} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">新增參與者</h2>
          </div>
          <button
            onClick={loadSample}
            className="text-xs font-bold px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition-all flex items-center gap-2 border border-indigo-100 shadow-sm active:scale-95"
          >
            <Sparkles size={14} className="text-indigo-500" /> 使用範例名單
          </button>
        </div>

        {!hasData && (
          <div className="mb-6 p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 bg-white/10 w-24 h-24 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h3 className="font-bold flex items-center gap-2 mb-1">
              <UserPlus size={18} /> 第一次來嗎？
            </h3>
            <p className="text-sm text-indigo-50 mb-3 opacity-90">
              點擊下方按鈕來填入範例名單，看看分組功能如何運作！
            </p>
            <button
              onClick={loadSample}
              className="w-full py-2 bg-white text-indigo-600 font-black rounded-xl text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              填入範例參與者
            </button>
          </div>
        )}

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2.5 ml-1">
              手動貼上名單
            </label>
            <textarea
              className="w-full h-36 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-gray-700 text-sm font-medium resize-none shadow-inner"
              placeholder="輸入名字，用換行或逗號分隔..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <button
            onClick={handleManualSubmit}
            disabled={!inputText.trim()}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-30 disabled:shadow-none active:scale-[0.98]"
          >
            加入目前名單
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-black">
              <span className="bg-white px-4 text-gray-400">或上傳檔案</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-center w-full">
              <label className="group flex flex-col items-center justify-center w-full h-40 border-2 border-gray-200 border-dashed rounded-3xl cursor-pointer bg-gray-50/50 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-300">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 group-hover:shadow-md transition-all mb-3">
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-indigo-500" />
                  </div>
                  <p className="mb-1 text-sm text-gray-600 font-semibold">
                    上傳 CSV 或文字檔
                  </p>
                  <p className="text-xs text-gray-400">拖放檔案到這裡</p>
                </div>
                <input type="file" className="hidden" accept=".csv,.txt" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-4 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-700 text-sm">
          <div className="bg-blue-100 p-2 rounded-xl shrink-0">
            <Info size={18} />
          </div>
          <p className="leading-relaxed">
            <strong>小撇步：</strong>重複偵測已啟用。如果您上傳了重複的檔案，我們會標記重複項目，讓您一鍵清理。
          </p>
        </div>
      </div>
    </div>
  );
};

export default NameManager;
