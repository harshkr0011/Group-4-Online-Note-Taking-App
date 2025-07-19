import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Feather, Zap, Lock, Cloud, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const HeroIllustration = () => (
    <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-lg mx-auto">
        <path d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z" fill="hsl(var(--primary) / 0.1)"/>
        <path d="M381.867 151.722C381.867 151.722 386.974 159.25 397.373 169.574C407.772 179.898 416.711 183.175 416.711 183.175L311.238 288.751C305.032 294.963 296.223 298.5 286.924 298.5H233.003L381.867 151.722Z" fill="hsl(var(--primary) / 0.8)"/>
        <path d="M305.292 298.5H286.924C296.223 298.5 305.032 294.963 311.238 288.751L416.711 183.175C412.392 182.261 406.126 179.13 397.373 169.574C388.621 160.018 383.953 154.512 381.867 151.722L233.003 298.5H251.371L305.292 298.5Z" fill="hsl(var(--primary) / 0.6)"/>
        <path d="M213.629 298.5H286.924C296.223 298.5 305.032 294.963 311.238 288.751L381.867 218.049V241.42L251.371 372.015H178.076C168.777 372.015 160.704 368.478 154.498 362.266L95.2887 303.01C89.0767 296.798 85.5432 287.978 85.5432 278.667V205.32L213.629 333.483V298.5Z" fill="hsl(var(--primary) / 0.8)"/>
        <rect x="139.814" y="139.691" width="232.062" height="232.324" rx="12" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="4"/>
        <path d="M286.924 298.5H213.629V333.483L85.5432 205.32V278.667C85.5432 287.978 89.0767 296.798 95.2887 303.01L154.498 362.266C160.704 368.478 168.777 372.015 178.076 372.015H251.371L381.867 241.42V218.049L311.238 288.751C305.032 294.963 296.223 298.5 286.924 298.5Z" fill="hsl(var(--primary) / 0.6)"/>
        <path d="M165.402 188.423H345.92" stroke="hsl(var(--muted-foreground))" strokeWidth="12" strokeLinecap="round"/>
        <path d="M165.402 235.34H345.92" stroke="hsl(var(--muted-foreground))" strokeWidth="12" strokeLinecap="round"/>
        <path d="M165.402 282.256H261.026" stroke="hsl(var(--muted-foreground))" strokeWidth="12" strokeLinecap="round"/>
    </svg>
);


export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-primary" />,
      title: "Effortless Editing",
      description: "Our rich text editor makes formatting a breeze. Focus on your ideas, not on the tools."
    },
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Secure & Private",
      description: "Your notes are yours alone. With robust security measures, your data stays safe."
    },
    {
      icon: <Cloud className="w-8 h-8 text-primary" />,
      title: "Always in Sync",
      description: "Access your notes from anywhere. Your content is automatically synced across all devices."
    }
  ];

  const testimonials = [
    {
      name: "Alex Johnson",
      title: "Software Developer",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "man portrait",
      quote: "FeatherNote has completely changed how I organize my thoughts. The interface is clean, intuitive, and just works. I can't imagine my workflow without it."
    },
    {
      name: "Maria Garcia",
      title: "UX Designer",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "woman portrait",
      quote: "The design is simply beautiful. It's a joy to use, and the dark mode is perfect for late-night brainstorming sessions. A truly elegant note-taking app."
    },
    {
      name: "David Chen",
      title: "Student",
      avatar: "https://placehold.co/100x100.png",
      dataAiHint: "person portrait",
      quote: "As a student, I'm constantly taking notes. FeatherNote helps me keep everything organized with tags and a powerful search. It's an essential tool for my studies."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2">
          <Feather className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold font-headline">FeatherNote</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                     <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pb-4">
                        Effortless Notes, Elegantly Crafted.
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto md:mx-0 text-lg text-muted-foreground">
                        Welcome to FeatherNote, where your ideas take flight. Capture thoughts, format with ease, and find everything in a beautifully organized space.
                    </p>
                    <div className="mt-8 flex justify-center md:justify-start gap-4">
                        <Button size="lg" asChild>
                        <Link href="/signup">Start for Free</Link>
                        </Button>
                        <Button size="lg" variant="outline">
                        Learn More
                        </Button>
                    </div>
                </div>
                 <div className="row-start-1 md:col-start-2">
                    <HeroIllustration />
                </div>
            </div>
        </section>

        <section id="features" className="py-20 bg-muted/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-headline">Why You'll Love FeatherNote</h2>
                    <p className="text-lg text-muted-foreground mt-2">Everything you need to be more productive.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {features.map(feature => (
                        <div key={feature.title} className="text-center p-6">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mx-auto mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-2xl font-bold font-headline mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        <section id="testimonials" className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold font-headline">What Our Users Say</h2>
                    <p className="text-lg text-muted-foreground mt-2">People love using FeatherNote. Here's why.</p>
                </div>
                <Carousel
                    opts={{ align: "start", loop: true }}
                    className="w-full max-w-4xl mx-auto"
                >
                    <CarouselContent>
                        {testimonials.map((testimonial, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                <div className="p-1 h-full">
                                    <Card className="flex flex-col justify-between h-full">
                                        <CardContent className="p-6">
                                            <div className="flex items-center mb-4">
                                                <Avatar className="h-12 w-12 mr-4">
                                                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.dataAiHint} />
                                                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold font-headline">{testimonial.name}</p>
                                                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                                </div>
                                            </div>
                                            <div className="flex mb-2">
                                                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />)}
                                            </div>
                                            <blockquote className="text-muted-foreground italic">"{testimonial.quote}"</blockquote>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </section>

        <section className="py-20 bg-muted/40">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="text-4xl font-bold font-headline">Ready to Take Flight?</h2>
                 <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                    Join thousands of users who are organizing their lives with FeatherNote. It's free to get started.
                </p>
                <div className="mt-8">
                     <Button size="lg" asChild>
                        <Link href="/signup">Sign Up Now</Link>
                    </Button>
                </div>
             </div>
        </section>

      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FeatherNote. All rights reserved.</p>
      </footer>
    </div>
  );
}
