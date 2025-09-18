import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { BarChart3, Calendar, Clock, TrendingUp, Trophy } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  image?: string;
  color?: string;
}

interface EventAnalyticsProps {
  events: Event[];
}

export function EventAnalytics({ events }: EventAnalyticsProps) {
  const now = new Date();
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  const upcomingEvents = events.filter(event => event.date > now);
  const pastEvents = events.filter(event => event.date <= now);
  const thisMonthEvents = events.filter(event => 
    event.date >= thisMonth && event.date < nextMonth
  );
  
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const thisWeekEvents = events.filter(event => 
    event.date >= now && event.date <= nextWeek
  );

  const averageDaysToEvent = upcomingEvents.length > 0 
    ? Math.round(upcomingEvents.reduce((sum, event) => {
        const daysUntil = Math.ceil((event.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return sum + daysUntil;
      }, 0) / upcomingEvents.length)
    : 0;

  const analytics = [
    {
      title: 'Total Events',
      value: events.length,
      change: '+12%',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'This Month',
      value: thisMonthEvents.length,
      change: '+5%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Upcoming',
      value: upcomingEvents.length,
      change: `${averageDaysToEvent}d avg`,
      icon: Clock,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Completed',
      value: pastEvents.length,
      change: '+8%',
      icon: Trophy,
      color: 'from-orange-500 to-red-500'
    }
  ];

  if (events.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="text-lg text-white font-medium">Analytics Overview</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass p-4 hover:glow transition-all duration-300">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-orbitron font-black text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat.title}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {thisWeekEvents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-4"
        >
          <Card className="glass p-4 border border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-primary font-medium">This Week's Events</span>
            </div>
            <div className="space-y-2">
              {thisWeekEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between text-sm">
                  <span className="text-white">{event.title}</span>
                  <span className="text-muted-foreground">
                    {event.date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              ))}
              {thisWeekEvents.length > 3 && (
                <div className="text-xs text-muted-foreground">
                  +{thisWeekEvents.length - 3} more events this week
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}