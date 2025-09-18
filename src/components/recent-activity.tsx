import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, Calendar, Plus, CheckCircle } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: Date;
  image?: string;
  color?: string;
}

interface RecentActivityProps {
  events: Event[];
}

export function RecentActivity({ events }: RecentActivityProps) {
  const now = new Date();
  const recentEvents = events
    .map(event => {
      const timeDiff = Math.abs(now.getTime() - event.date.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      return { ...event, daysDiff, isPast: event.date <= now };
    })
    .sort((a, b) => a.daysDiff - b.daysDiff)
    .slice(0, 5);

  if (events.length === 0) return null;

  const getActivityIcon = (event: any) => {
    if (event.isPast) return CheckCircle;
    if (event.daysDiff <= 7) return Clock;
    return Calendar;
  };

  const getActivityColor = (event: any) => {
    if (event.isPast) return 'text-green-500';
    if (event.daysDiff <= 7) return 'text-orange-500';
    return 'text-blue-500';
  };

  const getTimeText = (event: any) => {
    if (event.daysDiff === 0) return 'Today';
    if (event.daysDiff === 1) return event.isPast ? 'Yesterday' : 'Tomorrow';
    if (event.daysDiff <= 7) return `${event.daysDiff} days ${event.isPast ? 'ago' : 'away'}`;
    return `${event.daysDiff} days ${event.isPast ? 'ago' : 'away'}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg text-white font-medium">Recent Activity</h3>
      </div>
      
      <Card className="glass p-6">
        <div className="space-y-4">
          {recentEvents.map((event, index) => {
            const ActivityIcon = getActivityIcon(event);
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className={`p-2 rounded-full bg-card border ${getActivityColor(event)}`}>
                  <ActivityIcon className={`h-4 w-4 ${getActivityColor(event)}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium">{event.title}</span>
                    <Badge 
                      variant={event.isPast ? "secondary" : "default"}
                      className={event.isPast ? "" : "gradient-gold text-black"}
                    >
                      {event.isPast ? "Completed" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{getTimeText(event)}</span>
                    <span>•</span>
                    <span>
                      {event.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-sm font-medium ${getActivityColor(event)}`}>
                    {event.daysDiff === 0 ? 'Today' : `${event.daysDiff}d`}
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {events.length > 5 && (
            <div className="text-center pt-2 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Showing recent 5 of {events.length} events
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}