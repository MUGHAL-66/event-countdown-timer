import React from 'react';
import { motion } from 'motion/react';
import { Clock, Plus, Settings, History } from 'lucide-react';
import { Button } from './ui/button';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onCreateEvent: () => void;
}

export function Navbar({ currentView, onViewChange, onCreateEvent }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Clock },
    { id: 'history', label: 'Events', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-40 glass border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-8 h-8 rounded-lg gradient-gold flex items-center justify-center">
              <Clock className="h-5 w-5 text-black" />
            </div>
            <h1 className="text-white text-xl font-semibold hidden sm:block">
              Event Countdown
            </h1>
          </motion.div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? "default" : "ghost"}
                  onClick={() => onViewChange(item.id)}
                  className={`
                    relative
                    ${currentView === item.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:text-white'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                  {currentView === item.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary rounded-md -z-10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                </Button>
              );
            })}
          </div>

          {/* Create Event Button */}
          <Button
            onClick={onCreateEvent}
            className="gradient-gold text-black font-medium hover:glow hidden sm:flex"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>

          {/* Mobile menu button */}
          <Button
            onClick={onCreateEvent}
            size="sm"
            className="gradient-gold text-black font-medium hover:glow sm:hidden"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border/50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 h-auto py-2 ${
                  currentView === item.id 
                    ? 'text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}