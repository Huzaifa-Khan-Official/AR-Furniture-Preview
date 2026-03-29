'use client'

import { motion } from 'framer-motion';
import { Square, MousePointerClick, RotateCw, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Select Your Room',
    description: 'Set your room dimensions and units. Your space appears on the canvas instantly.',
    icon: Square,
    color: 'bg-primary',
  },
  {
    number: '02',
    title: 'Add Furniture',
    description: 'Browse the catalog and click to add sofas, beds, tables, and more.',
    icon: MousePointerClick,
    color: 'bg-secondary',
  },
  {
    number: '03',
    title: 'Arrange & Resize',
    description: 'Drag to move, pull handles to resize, and rotate to find the perfect angle.',
    icon: RotateCw,
    color: 'bg-violet-600',
  },
  {
    number: '04',
    title: 'Perfect Layout!',
    description: 'Your collision-free layout is ready. Auto-saved so you can come back anytime.',
    icon: CheckCircle2,
    color: 'bg-amber-500',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 bg-muted/40">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-inter font-extrabold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Four simple steps to your dream room layout
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="relative text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
              )}

              <div className={`relative z-10 w-20 h-20 mx-auto rounded-2xl ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                <step.icon className="w-9 h-9 text-white" />
              </div>
              <div className="text-sm font-bold text-primary tracking-wider mb-2">{step.number}</div>
              <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}