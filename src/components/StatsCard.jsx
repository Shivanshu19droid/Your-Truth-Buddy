import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCard({ title, value, icon: Icon, gradient, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`h-1 bg-gradient-to-r ${gradient}`} />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} bg-opacity-10`}>
              <Icon className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
