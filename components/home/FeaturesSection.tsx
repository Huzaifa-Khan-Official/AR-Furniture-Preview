'use client'

import { Ruler, Move, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Ruler,
    title: 'Easy Room Setup',
    description: 'Define your room dimensions in feet or meters. Set up your space in seconds with intuitive controls.',
    gradient: 'from-primary/10 to-primary/5',
    iconColor: 'text-primary',
  },
  {
    icon: Move,
    title: 'Drag & Drop Furniture',
    description: 'Choose from 7+ furniture items and place them instantly. Move, resize, and rotate with precision.',
    gradient: 'from-secondary/10 to-secondary/5',
    iconColor: 'text-secondary',
  },
  {
    icon: ShieldCheck,
    title: 'Smart Collision Detection',
    description: 'Real-time visual feedback prevents overlapping furniture. Stay within room boundaries effortlessly.',
    gradient: 'from-violet-100/60 to-violet-50/40',
    iconColor: 'text-violet-600',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-inter font-extrabold tracking-tight text-foreground">
            Everything you need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Powerful features packed into a simple, intuitive interface
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="group relative h-full p-8 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-lg transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}