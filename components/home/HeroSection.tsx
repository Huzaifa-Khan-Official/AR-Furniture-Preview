'use client'

import { Button } from '@/components/ui/button';
import { ArrowRight, Camera } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=80"
          alt="room"
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-linear-to-b from-white via-white/90 to-white" />
      </div>
      <div className="absolute top-20 right-0 w-125 h-125 bg-primary/8 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-100 h-100 bg-secondary/8 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl font-inter font-extrabold tracking-tight text-foreground leading-[1.05]"
            >
              Design Your
              <span className="block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent mt-1">
                Perfect Space
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed"
            >
              Place realistic furniture in a virtual room — or use your live camera for true augmented reality. 
              Drag, rotate, and resize until every piece fits perfectly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link href="/planner">
                <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold gap-2 shadow-lg shadow-primary/25 hover:shadow-xl transition-all w-full sm:w-auto">
                  Start Designing
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/planner">
                <Button variant="outline" size="lg" className="rounded-full px-8 h-14 text-base font-semibold gap-2 w-full sm:w-auto">
                  <Camera className="w-5 h-5" />
                  Try AR Camera
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-10 flex items-center gap-6"
            >
              {[['10+', 'Furniture items'], ['Live AR', 'Camera mode'], ['Free', 'No signup']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-xl font-extrabold text-foreground">{val}</div>
                  <div className="text-xs text-muted-foreground">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Room preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/40">
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=85"
                alt="Room preview"
                className="w-full aspect-4/3 object-cover"
              />
              {/* AR overlay effect */}
              <div className="absolute inset-0">
                {/* Yellow outline furniture mockups */}
                <div className="absolute bottom-[20%] left-[10%] w-[35%] h-[22%] border-[2.5px] border-yellow-400 rounded-sm" style={{ boxShadow: '0 0 10px rgba(251,191,36,0.4)' }}>
                  <div className="absolute -top-5 left-0 text-yellow-400 text-[10px] font-bold">Sofa</div>
                </div>
                <div className="absolute top-[25%] right-[15%] w-[22%] h-[30%] border-[2.5px] border-blue-400 rounded-sm" style={{ boxShadow: '0 0 10px rgba(59,130,246,0.4)' }}>
                  <div className="absolute -top-5 left-0 text-blue-400 text-[10px] font-bold">Bookshelf</div>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                AR Mode Active
              </div>
            </div>

            {/* Floating furniture card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg border border-border p-3 flex items-center gap-3"
            >
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=80&q=80"
                alt="sofa"
                className="w-14 h-10 object-cover rounded-lg"
              />
              <div>
                <div className="text-xs font-bold">Modern Sofa</div>
                <div className="text-xs text-muted-foreground">Placed ✓</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}