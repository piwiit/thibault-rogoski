"use client";
import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl px-2 py-6 mx-auto"
    >
      <h2 className="mb-3 font-sans text-2xl font-extrabold tracking-widest uppercase text-primary drop-shadow-sm">{title}</h2>
      <div className="text-neutral-50">{children}</div>
    </motion.section>
  );
}
