// components/Loader/Drawer.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuX } from 'react-icons/lu';

const Drawer = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'tween', duration: 0.3 }}
          className="fixed top-[64px] right-0 z-40 h-[calc(100dvh-64px)] p-4 overflow-y-auto transition-transform bg-white w-full md:w-[40vw] shadow-2xl shadow-cyan-800/10 border-l border-gray-200"
          tabIndex="-1"
          aria-labelledby="drawer-right-label"
        >
          <div className="flex items-center justify-between mb-4">
            <h5
              id="drawer-right-label"
              className="flex items-center text-base font-semibold text-black"
            >
              {title}
            </h5>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center"
            >
              <LuX className="text-lg" />
            </button>
          </div>

          <div className="text-sm mx-3 mb-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
