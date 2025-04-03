"use client"
import { motion } from "framer-motion"

interface CoreLearningDiagramProps {
  className?: string
}

export default function CoreLearningDiagram({ className = "" }: CoreLearningDiagramProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative w-full max-w-md mx-auto">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Mountain/Pyramid visualization */}
          <div className="relative w-full aspect-square max-w-md">
            {/* Advanced level (top) */}
            <motion.div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 py-4 bg-[#1e4b8e] text-white rounded-t-lg text-center shadow-lg z-30"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="font-bold">Advanced</h3>
              <p className="text-xs px-2 mt-1">Express complex ideas freely</p>
            </motion.div>

            {/* Connecting line */}
            <motion.div
              className="absolute top-[4rem] left-1/2 -translate-x-1/2 h-[3rem] w-0.5 bg-gray-300 z-20"
              initial={{ height: 0 }}
              animate={{ height: "3rem" }}
              transition={{ delay: 0.7, duration: 0.3 }}
            />

            {/* Intermediate level (middle) */}
            <motion.div
              className="absolute top-[7rem] left-1/2 -translate-x-1/2 w-1/2 py-4 bg-[#ffc72c] text-[#1e4b8e] rounded-lg text-center shadow-lg z-30"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="font-bold">Intermediate</h3>
              <p className="text-xs px-2 mt-1">Construct sentences to express thoughts</p>
            </motion.div>

            {/* Connecting line */}
            <motion.div
              className="absolute top-[11rem] left-1/2 -translate-x-1/2 h-[3rem] w-0.5 bg-gray-300 z-20"
              initial={{ height: 0 }}
              animate={{ height: "3rem" }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />

            {/* Beginner level (bottom) */}
            <motion.div
              className="absolute top-[14rem] left-1/2 -translate-x-1/2 w-2/3 py-4 bg-[#1e4b8e] text-white rounded-lg text-center shadow-lg z-30"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <h3 className="font-bold">Beginner</h3>
              <p className="text-xs px-2 mt-1">Adapt to English-only environment</p>
            </motion.div>

            {/* Background elements */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path d="M100,10 L180,180 L20,180 Z" fill="#1e4b8e" opacity="0.7" />
              </svg>
            </motion.div>
          </div>

          {/* Title */}
          <motion.h4
            className="mt-4 text-lg font-semibold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Core-Centered Learning Approach
          </motion.h4>
        </motion.div>
      </div>
    </div>
  )
}

