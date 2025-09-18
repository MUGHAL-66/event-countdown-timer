import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Calendar, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Event {
  id: string;
  title: string;
  date: Date;
  image?: string;
  color?: string;
}

interface EventFormProps {
  event?: Event;
  onSave: (event: Omit<Event, 'id'>) => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    date: event?.date ? event.date.toISOString().slice(0, 16) : '',
    image: event?.image || '',
    color: event?.color || '#F5A623'
  });

  const [previewImage, setPreviewImage] = useState<string>(event?.image || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date) return;
    
    onSave({
      title: formData.title,
      date: new Date(formData.date),
      image: previewImage,
      color: formData.color
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const colors = ['#F5A623', '#FFC857', '#FF5E5B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl h-full max-h-[90vh] overflow-hidden rounded-xl"
      >
        <div className="flex h-full">
          {/* Left side - Abstract image */}
          <div className="hidden lg:block w-1/2 relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1736607633200-7fa36bd1f413?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdvbGRlbiUyMHdhdmVzJTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzU4MTgwNDEzfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Abstract golden waves"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
          </div>
          
          {/* Right side - Form */}
          <Card className="w-full lg:w-1/2 glass border-0 rounded-none lg:rounded-l-none h-full overflow-y-auto">
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-white">{event ? 'Edit Event' : 'Create New Event'}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Event Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter event name"
                    className="bg-input border-border text-white placeholder:text-muted-foreground"
                    required
                  />
                </div>
                
                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-white flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date & Time
                    </Label>
                    <Input
                      id="date"
                      type="datetime-local"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="bg-input border-border text-white"
                      required
                    />
                  </div>
                </div>
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label className="text-white flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Cover Image (Optional)
                  </Label>
                  <div className="space-y-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="bg-input border-border text-white file:text-white file:bg-primary file:border-0 file:rounded-md file:px-3 file:py-1"
                    />
                    {previewImage && (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden">
                        <ImageWithFallback
                          src={previewImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPreviewImage('');
                            setFormData(prev => ({ ...prev, image: '' }));
                          }}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Theme Color */}
                <div className="space-y-2">
                  <Label className="text-white">Theme Color</Label>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          formData.color === color 
                            ? 'border-white scale-110' 
                            : 'border-transparent hover:border-muted-foreground'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Live Preview */}
                {formData.title && formData.date && (
                  <div className="space-y-2">
                    <Label className="text-white">Preview</Label>
                    <Card className="glass p-4">
                      <h3 className="text-white mb-2">{formData.title}</h3>
                      <p className="text-muted-foreground text-sm">
                        {new Date(formData.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </Card>
                  </div>
                )}
                
                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="flex-1 text-muted-foreground hover:text-white border border-border"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 gradient-gold text-black font-medium hover:glow"
                    disabled={!formData.title || !formData.date}
                  >
                    {event ? 'Update Event' : 'Create Event'}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </motion.div>
    </motion.div>
  );
}