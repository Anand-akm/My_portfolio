"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { testimonials } from "@/data/content";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What <span className="text-gradient">Clients Say</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Feedback from people I&apos;ve had the pleasure of working with.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <Card className="p-8 glass hover:border-primary/50 transition-all h-full relative">
                <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/20" />
                
                <p className="text-muted-foreground mb-6 relative z-10 leading-relaxed">
                  &quot;{testimonial.content}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}