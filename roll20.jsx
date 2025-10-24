import React, { useState } from 'react';
import { Dices } from 'lucide-react';

export default function DiceGame() {
  const TOTAL_SIDES = 20;
  const [greenSides, setGreenSides] = useState(1);
  const [currentSide, setCurrentSide] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [rollCount, setRollCount] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // progressHistory tracks the number of green sides after each completed roll (initial state included)
  const [progressHistory, setProgressHistory] = useState([1]);

  const rollDice = () => {
    if (gameWon || isRolling) return;

    setIsRolling(true);
    setRollCount(prev => prev + 1);

    // Simulate rolling animation
    let rolls = 0;
    const rollInterval = setInterval(() => {
      const tempRoll = Math.floor(Math.random() * TOTAL_SIDES) + 1;
      setCurrentSide(tempRoll);
      rolls++;

      if (rolls >= 10) {
        clearInterval(rollInterval);
        
        // Final roll
        const finalRoll = Math.floor(Math.random() * TOTAL_SIDES) + 1;
        const isGreen = finalRoll <= greenSides;
        setCurrentSide(finalRoll);

        // If landed on green, add another green side (with a tiny delay for effect)
        if (isGreen && greenSides < TOTAL_SIDES) {
          setTimeout(() => {
            setGreenSides(prev => {
              const newGreenCount = prev + 1;
              // record the new progress after the increment
              setProgressHistory(h => [...h, newGreenCount]);
              
              if (newGreenCount === TOTAL_SIDES) {
                setGameWon(true);
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
              }
              return newGreenCount;
            });
          }, 500);
        } else {
          // record progress even when nothing changes (a roll happened)
          setProgressHistory(h => [...h, greenSides]);
        }

        setIsRolling(false);
      }
    }, 100);
  };

  const resetGame = () => {
    setGreenSides(1);
    setCurrentSide(null);
    setRollCount(0);
    setGameWon(false);
    setShowConfetti(false);
    setProgressHistory([1]);
  };

  const isCurrentSideGreen = currentSide !== null && currentSide <= greenSides;

  // Prepare SVG polyline points for the chart (0..100 coordinate space)
  const chartPoints = progressHistory.length > 0
    ? progressHistory.map((g, i) => {
        const x = progressHistory.length === 1 ? 0 : (i / (progressHistory.length - 1)) * 100;
        const y = 100 - (g / TOTAL_SIDES) * 100;
        return `${x},${y}`;
      }).join(' ')
    : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-8">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            >
              <div className="text-2xl">
                {['🎉', '✨', '🎊', '💚', '🎯'][Math.floor(Math.random() * 5)]}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Dices className="w-12 h-12" />
            The Green Die Challenge
          </h1>
          <p className="text-gray-300 text-lg">
            Roll the 20-sided die and turn all sides green!
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Current Roll Display */}
          <div className="flex justify-center mb-8">
            <div 
              className={`w-48 h-48 rounded-3xl flex items-center justify-center text-8xl font-bold shadow-2xl transition-all duration-300 ${
                isRolling 
                  ? 'animate-spin bg-gradient-to-br from-red-400 to-green-400' 
                  : currentSide === null
                  ? 'bg-gradient-to-br from-gray-600 to-gray-800 text-gray-400'
                  : isCurrentSideGreen
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white scale-110'
                  : 'bg-gradient-to-br from-red-500 to-red-700 text-white'
              }`}
            >
              {currentSide === null ? '?' : currentSide}
            </div>
          </div>

          {/* Game Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Green Sides</div>
              <div className="text-3xl font-bold text-green-400">{greenSides}</div>
              <div className="text-gray-500 text-xs">of {TOTAL_SIDES}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Red Sides</div>
              <div className="text-3xl font-bold text-red-400">{TOTAL_SIDES - greenSides}</div>
              <div className="text-gray-500 text-xs">remaining</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 text-center">
              <div className="text-gray-400 text-sm mb-1">Rolls</div>
              <div className="text-3xl font-bold text-blue-400">{rollCount}</div>
              <div className="text-gray-500 text-xs">total</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{Math.round((greenSides / TOTAL_SIDES) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500 ease-out"
                style={{ width: `${(greenSides / TOTAL_SIDES) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Side Status */}
          {currentSide !== null && !gameWon && (
            <div className={`text-center mb-6 p-4 rounded-xl ${
              isCurrentSideGreen 
                ? 'bg-green-500/20 border border-green-500/50' 
                : 'bg-red-500/20 border border-red-500/50'
            }`}>
              <p className={`text-lg font-semibold ${
                isCurrentSideGreen ? 'text-green-300' : 'text-red-300'
              }`}>
                {isCurrentSideGreen 
                  ? '🎯 GREEN! Another side turns green!' 
                  : '❌ RED! Nothing happens.'}
              </p>
            </div>
          )}

          {/* Win Message */}
          {gameWon && (
            <div>
              <div className="text-center mb-6 p-6 rounded-xl bg-gradient-to-r from-green-500/30 to-emerald-500/30 border-2 border-green-400">
                <p className="text-3xl font-bold text-green-300 mb-2">
                  🎉 YOU WIN! 🎉
                </p>
                <p className="text-gray-300">
                  All {TOTAL_SIDES} sides are green in just {rollCount} rolls!
                </p>
              </div>

              {/* Progress Graph (appears after game complete) */}
              <div className="mt-4 mb-6 p-4 bg-white/5 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-2">Progress Over Rolls</h3>

                <div className="w-full">
                  <svg viewBox="0 0 100 100" className="w-full h-44">
                    {/* shaded area under the curve */}
                    {chartPoints && (
                      <polyline
                        points={`0,100 ${chartPoints} 100,100`}
                        fill="rgba(16,185,129,0.12)"
                        stroke="none"
                      />
                    )}

                    {/* line */}
                    {chartPoints && (
                      <polyline
                        points={chartPoints}
                        fill="none"
                        stroke="#34D399"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* dots for each recorded point */}
                    {progressHistory.map((g, i) => {
                      const x = progressHistory.length === 1 ? 0 : (i / (progressHistory.length - 1)) * 100;
                      const y = 100 - (g / TOTAL_SIDES) * 100;
                      return (
                        <circle
                          key={i}
                          cx={x}
                          cy={y}
                          r={1.6}
                          fill="#10B981"
                          stroke="#064E3B"
                          strokeWidth={0.3}
                        />
                      );
                    })}

                    {/* simple axis markers: left (0%) and top (100%) labels */}
                    <text x="0" y="10" className="text-xs" fill="#9CA3AF" fontSize="4">100%</text>
                    <text x="0" y="98" className="text-xs" fill="#9CA3AF" fontSize="4">0%</text>
                  </svg>

                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Start</span>
                    <span>Rolls: {progressHistory.length - 1}</span>
                    <span>Finish</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={rollDice}
              disabled={isRolling || gameWon}
              className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all ${
                isRolling || gameWon
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg'
              }`}
            >
              {isRolling ? 'Rolling...' : gameWon ? 'Game Complete!' : '🎲 Roll Die'}
            </button>
            <button
              onClick={resetGame}
              className="px-6 py-4 rounded-xl font-bold text-lg bg-gray-700 text-white hover:bg-gray-600 transition-all"
            >
              🔄 Reset
            </button>
          </div>

          {/* Game Rules */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl text-sm text-gray-400">
            <p className="font-semibold text-white mb-2">How to Play:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>The die starts with 1 green side and 19 red sides</li>
              <li>Roll the die to see which side it lands on</li>
              <li>If you land on GREEN: one red side turns green! 🎯</li>
              <li>If you land on RED: nothing happens ❌</li>
              <li>Win by turning all {TOTAL_SIDES} sides green!</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>Your odds improve with each green side you unlock!</p>
        </div>
      </div>
    </div>
  );
}