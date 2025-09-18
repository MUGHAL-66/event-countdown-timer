import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Edit, Trash2, Share } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { CountdownTimer } from './countdown-timer';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Event {
  id: string;
  title: string;
  date: Date;
  image?: string;
  color?: string;
}

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (eventId: string) => void;
  onShare?: (event: Event) => void;
  onSelect?: (event: Event) => void;
  variant?: 'grid' | 'carousel';
}

export function EventCard({ 
  event, 
  onEdit, 
  onDelete, 
  onShare, 
  onSelect,
  variant = 'grid' 
}: EventCardProps) {
  const isExpired = new Date() > event.date;
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="glass overflow-hidden group cursor-pointer hover:glow transition-all duration-300" 
            onClick={() => onSelect?.(event)}>
        {/* Event Image */}
        <div className="relative h-48 overflow-hidden">
          {event.image ? (
            <ImageWithFallback
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full gradient-gold opacity-80" />
          )}
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.(event);
              }}
            >
              <Share className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(event);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-red-600 text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(event.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Status badge */}
          {isExpired && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-xs font-medium">
              Expired
            </div>
          )}
        </div>
        
        {/* Event Details */}
        <div className="p-6">
          <h3 className="text-white mb-3 truncate">{event.title}</h3>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {event.date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {event.date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          
          {/* Mini countdown */}
          {!isExpired && (
            <div className="mt-4">
              <CountdownTimer 
                targetDate={event.date} 
                size="small" 
                showProgress={false}
              />
            </div>
          )}
          
          {isExpired && (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm">Event has passed</p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}