import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Star, Zap, Share2, Bell, ChevronRight, Users, Calendar, Clock, Trophy, Heart, PartyPopper, Search, Filter, SortAsc, SortDesc, Grid, List, BarChart3, TrendingUp } from 'lucide-react';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Switch } from './components/ui/switch';
import { Label } from './components/ui/label';
import { Separator } from './components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Badge } from './components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { Navbar } from './components/navbar';
import { CountdownTimer } from './components/countdown-timer';
import { EventCard } from './components/event-card';
import { EventForm } from './components/event-form';
import { Confetti } from './components/confetti';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import { FloatingParticles } from './components/floating-particles';
import { EventAnalytics } from './components/event-analytics';
import { QuickActions } from './components/quick-actions';
import { FloatingActionButton } from './components/floating-action-button';
import { RecentActivity } from './components/recent-activity';

interface Event {
  id: string;
  title: string;
  date: Date;
  image?: string;
  color?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    theme: 'dark'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('countdown-events');
    if (savedEvents) {
      const parsed = JSON.parse(savedEvents);
      setEvents(parsed.map((e: any) => ({ ...e, date: new Date(e.date) })));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('countdown-events', JSON.stringify(events));
  }, [events]);

  // Find the next upcoming event for main display
  const nextEvent = events
    .filter(event => event.date > new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const handleCreateEvent = (eventData: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents(prev => [...prev, newEvent]);
    setShowEventForm(false);
    toast.success('Event created successfully!');
  };

  const handleEditEvent = (eventData: Omit<Event, 'id'>) => {
    if (!editingEvent) return;
    setEvents(prev => prev.map(event => 
      event.id === editingEvent.id 
        ? { ...eventData, id: editingEvent.id }
        : event
    ));
    setEditingEvent(null);
    setShowEventForm(false);
    toast.success('Event updated successfully!');
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    toast.success('Event deleted successfully!');
  };

  const handleEventComplete = () => {
    setShowConfetti(true);
    if (settings.notifications) {
      toast.success('🎉 Time\'s up! Your event is here!');
    }
  };

  const handleShareEvent = (event: Event) => {
    const shareText = `Check out my countdown to ${event.title} on ${event.date.toLocaleDateString()}!`;
    if (navigator.share) {
      navigator.share({
        title: 'Event Countdown',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Event details copied to clipboard!');
    }
  };

  // Home View
  const HomeView = () => (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1578041803820-27c0571e6983?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBldmVudCUyMGNlbGVicmF0aW9uJTIwcGFydHklMjBsaWdodHN8ZW58MXx8fHwxNzU4MTgwNzAxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Luxury event celebration"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              background: [
                'radial-gradient(circle at 20% 80%, rgba(245, 166, 35, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(255, 200, 87, 0.15) 0%, transparent 50%)',
                'radial-gradient(circle at 40% 40%, rgba(245, 166, 35, 0.15) 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
          />
          <FloatingParticles />
        </div>

        <div className="relative z-10 text-center space-y-8 px-4 max-w-5xl mx-auto">
          {nextEvent ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Next Event</span>
                </div>
                <h1 className="text-4xl lg:text-7xl text-white mb-4 font-bold tracking-tight">{nextEvent.title}</h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-playfair italic">
                  "Every second counts until the moment arrives"
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <CountdownTimer 
                  targetDate={nextEvent.date} 
                  onComplete={handleEventComplete}
                />
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6">
                  <PartyPopper className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">Premium Event Timer</span>
                </div>
                <h1 className="text-4xl lg:text-7xl text-white mb-6 font-bold tracking-tight leading-tight">
                  Event Countdown Timer
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground font-playfair italic mb-8 max-w-3xl mx-auto">
                  "Create memorable moments with precision timing and luxury design"
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Button
                  onClick={() => setShowEventForm(true)}
                  size="lg"
                  className="gradient-gold text-black font-medium hover:glow text-lg px-8 py-6 shadow-2xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Event
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6"
                  onClick={() => setCurrentView('history')}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  View Examples
                </Button>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-card/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl text-white mb-4">Trusted by Event Planners Worldwide</h2>
            <p className="text-muted-foreground text-lg">Join thousands who trust us with their most important moments</p>
          </motion.div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Events Created', icon: Calendar },
              { number: '25K+', label: 'Happy Users', icon: Users },
              { number: '99.9%', label: 'Uptime', icon: Zap },
              { number: '4.9★', label: 'User Rating', icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-gold mb-4">
                  <stat.icon className="h-8 w-8 text-black" />
                </div>
                <div className="text-3xl lg:text-4xl font-orbitron font-black text-white mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Showcase */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl text-white mb-4">Perfect for Every Occasion</h2>
            <p className="text-muted-foreground text-lg">From intimate gatherings to grand celebrations</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Weddings',
                description: 'Count down to your special day with elegant precision',
                image: 'https://images.unsplash.com/photo-1636665393783-3c38262cb9e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VsZWJyYXRpb24lMjBicmlkZSUyMGdyb29tfGVufDF8fHx8MTc1ODE4MDcxMHww&ixlib=rb-4.1.0&q=80&w=1080',
                icon: Heart
              },
              {
                title: 'Corporate Events',
                description: 'Professional countdowns for product launches and meetings',
                image: 'https://images.unsplash.com/photo-1590650046871-92c887180603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmclMjBzdWNjZXNzfGVufDF8fHx8MTc1ODE4MDcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                icon: Trophy
              },
              {
                title: 'Celebrations',
                description: 'New Year, birthdays, and milestone moments',
                image: 'https://images.unsplash.com/photo-1579161850250-f419aa9afefb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5ZWFyJTIwY291bnRkb3duJTIwZmlyZXdvcmtzJTIwY2VsZWJyYXRpb258ZW58MXx8fHwxNzU4MTgwNzIwfDA&ixlib=rb-4.1.0&q=80&w=1080',
                icon: PartyPopper
              }
            ].map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group"
              >
                <Card className="glass overflow-hidden hover:glow transition-all duration-500">
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={type.image}
                      alt={type.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center">
                        <type.icon className="h-6 w-6 text-black" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white mb-2">{type.title}</h3>
                    <p className="text-muted-foreground">{type.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {events.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl lg:text-4xl text-white mb-4">Upcoming Events</h2>
              <p className="text-muted-foreground">Track all your important moments</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(event => event.date > new Date())
                .slice(0, 6)
                .map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <EventCard 
                      event={event}
                      onEdit={(e) => {
                        setEditingEvent(e);
                        setShowEventForm(true);
                      }}
                      onDelete={handleDeleteEvent}
                      onShare={handleShareEvent}
                      onSelect={setSelectedEvent}
                    />
                  </motion.div>
                ))}
            </div>
            
            {events.filter(e => e.date > new Date()).length > 6 && (
              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentView('history')}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  View All Events
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-card/10 to-card/30 relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1732203971761-e9d4a6f5e93f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtb2Rlcm4lMjB0ZWNobm9sb2d5JTIwZGFzaGJvYXJkJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1ODEyMDI5NHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Modern technology interface"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl text-white mb-4">Powerful Features</h2>
            <p className="text-muted-foreground text-lg">Everything you need for perfect timing</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'Real-time Sync',
                description: 'Keep your countdowns synchronized across all devices with instant updates',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                icon: Bell,
                title: 'Confetti Alerts',
                description: 'Celebrate when your events arrive with beautiful animations and notifications',
                color: 'from-pink-500 to-red-500'
              },
              {
                icon: Share2,
                title: 'Easy Sharing',
                description: 'Share your events with friends and family instantly via social media',
                color: 'from-blue-500 to-purple-500'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="glass p-8 text-center hover:glow transition-all duration-500 group h-full">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-white mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl text-white mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">Real feedback from real event planners</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Chen',
                role: 'Wedding Planner',
                image: 'https://images.unsplash.com/photo-1739298061757-7a3339cee982?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMHNtaWxpbmd8ZW58MXx8fHwxNzU4MTgwNzA3fDA&ixlib=rb-4.1.0&q=80&w=1080',
                testimonial: 'This countdown timer has transformed how I present wedding timelines to couples. The luxury design perfectly matches our brand aesthetic.',
                rating: 5
              },
              {
                name: 'Marcus Rodriguez',
                role: 'Corporate Event Manager',
                image: 'https://images.unsplash.com/photo-1590650046871-92c887180603?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBidXNpbmVzcyUyMG1lZXRpbmclMjBzdWNjZXNzfGVufDF8fHx8MTc1ODE4MDcxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
                testimonial: 'Perfect for product launches and conferences. The professional look and reliable timing have impressed all our stakeholders.',
                rating: 5
              },
              {
                name: 'Emily Johnson',
                role: 'Party Planner',
                image: 'https://images.unsplash.com/photo-1559443065-31b290d9c9c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBjZWxlYnJhdGlvbiUyMGNhcHxlbnwxfHx8fDE3NTgxODA3MTN8MA&ixlib=rb-4.1.0&q=80&w=1080',
                testimonial: 'The confetti animations when events complete always bring smiles to faces. It adds that special touch to every celebration.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="glass p-6 h-full">
                  <div className="flex items-center mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="text-white font-medium">{testimonial.name}</h4>
                      <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-primary fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic font-playfair">"{testimonial.testimonial}"</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="glass p-8 lg:p-12 border border-primary/20">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full gradient-gold flex items-center justify-center mx-auto mb-6"
              >
                <Bell className="h-8 w-8 text-black" />
              </motion.div>
              <h3 className="text-3xl text-white mb-4">Stay in the Loop</h3>
              <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                Get notified about new features, countdown tips, and exclusive event planning resources
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-input border-border text-white flex-1"
                />
                <Button className="gradient-gold text-black font-medium hover:glow px-8">
                  Subscribe
                </Button>
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                Join 10,000+ event planners who trust our updates
              </p>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );

  // Filter and sort events
  const filteredAndSortedEvents = events
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const now = new Date();
      
      if (filterStatus === 'upcoming') return event.date > now && matchesSearch;
      if (filterStatus === 'past') return event.date <= now && matchesSearch;
      return matchesSearch;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'date') {
        comparison = a.date.getTime() - b.date.getTime();
      } else if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title);
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const upcomingEvents = events.filter(event => event.date > new Date());
  const pastEvents = events.filter(event => event.date <= new Date());
  const thisWeekEvents = events.filter(event => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    return event.date >= now && event.date <= weekFromNow;
  });

  // History View
  const HistoryView = () => (
    <div className="min-h-screen pt-16">
      {/* Hero Section with Background */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1712903276040-c99b32a057eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldmVudCUyMHBsYW5uaW5nJTIwY2FsZW5kYXIlMjBvcmdhbml6YXRpb258ZW58MXx8fHwxNzU4MTgwOTIxfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Event planning organization"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/80 to-background/90" />
          <FloatingParticles />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">Event Dashboard</span>
            </div>
            <h1 className="text-4xl lg:text-6xl text-white mb-4 font-bold tracking-tight">Your Events</h1>
            <p className="text-xl text-muted-foreground font-playfair italic max-w-2xl mx-auto">
              "Organize, track, and celebrate every important moment"
            </p>
          </motion.div>

          {/* Stats Cards */}
          {events.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            >
              {[
                { 
                  label: 'Total Events', 
                  value: events.length, 
                  icon: Calendar,
                  color: 'from-blue-500 to-cyan-500'
                },
                { 
                  label: 'Upcoming', 
                  value: upcomingEvents.length, 
                  icon: Clock,
                  color: 'from-green-500 to-emerald-500'
                },
                { 
                  label: 'This Week', 
                  value: thisWeekEvents.length, 
                  icon: TrendingUp,
                  color: 'from-purple-500 to-pink-500'
                },
                { 
                  label: 'Completed', 
                  value: pastEvents.length, 
                  icon: Trophy,
                  color: 'from-yellow-500 to-orange-500'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass p-6 text-center hover:glow transition-all duration-300">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-2xl font-orbitron font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="relative w-32 h-32 mx-auto mb-8">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1597004475902-3f8c38279a4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbXB0eSUyMHN0YXRlJTIwaWxsdXN0cmF0aW9uJTIwbWluaW1hbHxlbnwxfHx8fDE3NTgxODA5MjR8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Empty state"
                className="w-full h-full object-cover rounded-full opacity-50"
              />
              <div className="absolute inset-0 rounded-full gradient-gold opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Plus className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl text-white mb-3">No Events Yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your countdown journey by creating your first event. Whether it's a wedding, birthday, or business launch - we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setShowEventForm(true)}
                className="gradient-gold text-black font-medium hover:glow"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Event
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentView('home')}
                className="border-primary text-primary hover:bg-primary/10"
                size="lg"
              >
                <PartyPopper className="h-4 w-4 mr-2" />
                View Examples
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Quick Actions */}
            <QuickActions 
              onCreateEvent={() => setShowEventForm(true)}
              onExportEvents={() => {
                const dataStr = JSON.stringify(events, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = 'countdown-events.json';
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              eventsCount={events.length}
            />

            {/* Analytics Section */}
            <EventAnalytics events={events} />

            {/* Recent Activity */}
            <RecentActivity events={events} />

            {/* Search and Filter Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="glass p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 w-full lg:max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-input border-border text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 items-center">
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 bg-input border-border text-white">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-36 bg-input border-border text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Sort by Date</SelectItem>
                        <SelectItem value="title">Sort by Title</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="border-border text-muted-foreground hover:text-white"
                    >
                      {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                    </Button>

                    <div className="flex bg-input rounded-md p-1">
                      <Button
                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? 'gradient-gold text-black' : 'text-muted-foreground'}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                        size="sm"
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? 'gradient-gold text-black' : 'text-muted-foreground'}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Events Display */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-card">
                <TabsTrigger value="all" className="data-[state=active]:gradient-gold data-[state=active]:text-black">
                  All Events ({filteredAndSortedEvents.length})
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:gradient-gold data-[state=active]:text-black">
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger value="past" className="data-[state=active]:gradient-gold data-[state=active]:text-black">
                  Completed ({pastEvents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                <EventsGrid events={filteredAndSortedEvents} viewMode={viewMode} />
              </TabsContent>

              <TabsContent value="upcoming" className="mt-6">
                <EventsGrid 
                  events={upcomingEvents.filter(event => 
                    event.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )} 
                  viewMode={viewMode} 
                />
              </TabsContent>

              <TabsContent value="past" className="mt-6">
                <EventsGrid 
                  events={pastEvents.filter(event => 
                    event.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )} 
                  viewMode={viewMode} 
                />
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );

  // Events Grid Component
  const EventsGrid = ({ events, viewMode }: { events: Event[], viewMode: 'grid' | 'list' }) => {
    if (events.length === 0) {
      return (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg text-white mb-2">No events found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      );
    }

    return (
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={viewMode === 'list' ? "w-full" : ""}
          >
            {viewMode === 'list' ? (
              <Card className="glass p-4 hover:glow transition-all duration-300">
                <div className="flex items-center gap-4">
                  {event.image && (
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{event.title}</h3>
                      <Badge 
                        variant={event.date > new Date() ? "default" : "secondary"}
                        className={event.date > new Date() ? "gradient-gold text-black" : ""}
                      >
                        {event.date > new Date() ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {event.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingEvent(event);
                        setShowEventForm(true);
                      }}
                      className="border-border text-muted-foreground hover:text-white"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShareEvent(event)}
                      className="border-border text-muted-foreground hover:text-white"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => setSelectedEvent(event)}
                      className="gradient-gold text-black hover:glow"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <EventCard 
                event={event}
                onEdit={(e) => {
                  setEditingEvent(e);
                  setShowEventForm(true);
                }}
                onDelete={handleDeleteEvent}
                onShare={handleShareEvent}
                onSelect={setSelectedEvent}
              />
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  // Settings View
  const SettingsView = () => (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-white mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your countdown experience</p>
        </motion.div>

        <Card className="glass p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when events complete</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notifications: checked }))
                }
              />
            </div>
            
            <Separator className="bg-border" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Sound Alerts</Label>
                <p className="text-sm text-muted-foreground">Play sound when timer completes</p>
              </div>
              <Switch
                checked={settings.sound}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, sound: checked }))
                }
              />
            </div>
            
            <Separator className="bg-border" />
            
            <div>
              <Label className="text-white mb-3 block">Export Data</Label>
              <Button
                variant="outline"
                onClick={() => {
                  const dataStr = JSON.stringify(events, null, 2);
                  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                  const exportFileDefaultName = 'countdown-events.json';
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', exportFileDefaultName);
                  linkElement.click();
                }}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Download Events Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  // Full Screen Event View
  const EventView = () => {
    if (!selectedEvent) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background z-50 flex flex-col"
      >
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          {/* Background */}
          {selectedEvent.image && (
            <div className="absolute inset-0">
              <ImageWithFallback
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          )}
          
          <div className="relative z-10 text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-6xl text-white mb-4">{selectedEvent.title}</h1>
              <p className="text-xl text-muted-foreground">
                {selectedEvent.date.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <CountdownTimer 
                targetDate={selectedEvent.date} 
                onComplete={handleEventComplete}
              />
            </motion.div>
            
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => handleShareEvent(selectedEvent)}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Event
              </Button>
              <Button
                variant="ghost"
                onClick={() => setSelectedEvent(null)}
                className="text-muted-foreground hover:text-white"
              >
                Back to Events
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-background dark">
      <Navbar 
        currentView={currentView}
        onViewChange={setCurrentView}
        onCreateEvent={() => setShowEventForm(true)}
      />
      
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <EventView key="event-view" />
        ) : (
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'home' && <HomeView />}
            {currentView === 'history' && <HistoryView />}
            {currentView === 'settings' && <SettingsView />}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEventForm && (
          <EventForm
            event={editingEvent || undefined}
            onSave={editingEvent ? handleEditEvent : handleCreateEvent}
            onCancel={() => {
              setShowEventForm(false);
              setEditingEvent(null);
            }}
          />
        )}
      </AnimatePresence>

      <Confetti 
        active={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <FloatingActionButton 
        onClick={() => setShowEventForm(true)}
        show={currentView === 'history'}
      />
    </div>
  );
}