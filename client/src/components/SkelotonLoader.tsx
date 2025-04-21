import { motion } from "framer-motion";

export const ConversationSkeleton = () => {
  return (
    <div className="relative w-60 h-[84px] bg-gray-100 rounded-lg overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export const UsersSkeleton = () => {
  return (
    <div className="relative h-[50px] bg-gray-100 rounded-lg overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};
