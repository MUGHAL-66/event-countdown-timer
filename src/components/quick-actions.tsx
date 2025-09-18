import React from 'react';
import { motion } from 'motion/react';
import { Plus, Download, Upload, Calendar, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface QuickActionsProps {
  onCreateEvent: () => void;
  onExportEvents: () => void;
  eventsCount: number;
}

export function QuickActions({ onCreateEvent, onExportEvents, eventsCount }: QuickActionsProps) {
  const quickActions = [
    {
      title: 'Create Event',
      description: 'Start a new countdown',
      icon: Plus,
      action: onCreateEvent,
      color: 'gradient-gold text-black',
      primary: true
    },
    {
      title: 'Export Data',
      description: 'Download your events',
      icon: Download,
      action: onExportEvents,
      color: 'border-primary text-primary hover:bg-primary/10',
      disabled: eventsCount === 0
    },
    {
      title: 'Quick Wedding',
      description: 'Wedding template',
      icon: Gift,
      action: () => {
        // Create wedding template
        const weddingDate = new Date();
        weddingDate.setMonth(weddingDate.getMonth() + 6);
        // This would open form with pre-filled wedding data
        onCreateEvent();
      },
      color: 'border-pink-500 text-pink-500 hover:bg-pink-500/10'
    },
    {
      title: 'Business Event',
      description: 'Corporate template',
      icon: Calendar,
      action: () => {
        // Create business template
        onCreateEvent();
      },
      color: 'border-blue-500 text-blue-500 hover:bg-blue-500/10'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <h3 className="text-lg text-white font-medium mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className={`glass p-4 cursor-pointer hover:glow transition-all duration-300 ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={() => !action.disabled && action.action()}
            >
              <div className="text-center">
                <div className={`w-12 h-12 rounded-full ${
                  action.primary 
                    ? 'gradient-gold' 
                    : 'bg-card border-2 ' + action.color.split(' ')[0].replace('border-', 'border-')
                } flex items-center justify-center mx-auto mb-3`}>
                  <action.icon className={`h-6 w-6 ${
                    action.primary ? 'text-black' : action.color.split(' ')[1]
                  }`} />
                </div>
                <h4 className="text-white text-sm font-medium mb-1">{action.title}</h4>
                <p className="text-muted-foreground text-xs">{action.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}