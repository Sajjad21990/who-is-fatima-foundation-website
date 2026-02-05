'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal } from 'lucide-react';

interface Winner {
    rank: number;
    submissionId: string;
    userDetails: any;
    score: number;
    totalPoints: number;
}

export default function Podium({ winners }: { winners: Winner[] }) {
    const gold = winners.find(w => w.rank === 1);
    const silver = winners.find(w => w.rank === 2);
    const bronze = winners.find(w => w.rank === 3);

    return (
        <div className="flex items-end justify-center gap-4 h-[400px] w-full max-w-4xl mx-auto p-8 mt-[10vh]">
            {/* Silver - 2nd Place */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center w-1/3"
            >
                {silver && (
                    <div className="flex flex-col items-center w-full">
                        <div className="mb-4 text-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-2 mx-auto border-4 border-white shadow-lg">
                                <span className="text-xl font-bold text-gray-600">{silver.userDetails.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 line-clamp-1">{silver.userDetails.name}</h3>
                            <p className="text-sm text-gray-500">{silver.score}/{silver.totalPoints}</p>
                        </div>
                        <div className="w-full h-48 bg-gradient-to-t from-gray-300 to-gray-100 rounded-t-lg flex items-end justify-center pb-4 shadow-xl relative group">
                            <span className="text-4xl font-bold text-gray-400 group-hover:text-gray-500 transition-colors">2</span>
                            <Medal className="absolute top-4 w-8 h-8 text-gray-400" />
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Gold - 1st Place */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center w-1/3 z-10"
            >
                {gold && (
                    <div className="flex flex-col items-center w-full">
                        <div className="mb-4 text-center">
                            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mb-2 mx-auto border-4 border-white shadow-lg relative">
                                <Trophy className="w-8 h-8 text-yellow-500 absolute -top-4 -right-2 transform rotate-12" />
                                <span className="text-2xl font-bold text-yellow-600">{gold.userDetails.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-bold text-[#1D3557] text-lg line-clamp-1">{gold.userDetails.name}</h3>
                            <p className="text-sm text-gray-500">{gold.score}/{gold.totalPoints}</p>
                        </div>
                        <div className="w-full h-64 bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-t-lg flex items-end justify-center pb-4 shadow-xl relative group">
                            <span className="text-5xl font-bold text-yellow-500 group-hover:text-yellow-600 transition-colors">1</span>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Bronze - 3rd Place */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center w-1/3"
            >
                {bronze && (
                    <div className="flex flex-col items-center w-full">
                        <div className="mb-4 text-center">
                            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2 mx-auto border-4 border-white shadow-lg">
                                <span className="text-xl font-bold text-orange-600">{bronze.userDetails.name.charAt(0)}</span>
                            </div>
                            <h3 className="font-bold text-gray-800 line-clamp-1">{bronze.userDetails.name}</h3>
                            <p className="text-sm text-gray-500">{bronze.score}/{bronze.totalPoints}</p>
                        </div>
                        <div className="w-full h-32 bg-gradient-to-t from-orange-300 to-orange-100 rounded-t-lg flex items-end justify-center pb-4 shadow-xl relative group">
                            <span className="text-4xl font-bold text-orange-400 group-hover:text-orange-500 transition-colors">3</span>
                            <Medal className="absolute top-4 w-8 h-8 text-orange-400" />
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
