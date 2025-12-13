import { Card, CardContent } from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Quote } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Regular Donor",
      image: "https://images.unsplash.com/photo-1754507128300-5d2023d3958c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU2NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      quote: "HopeGive has completely changed my perspective on giving. Seeing the direct impact of my donations through their transparent reporting makes me feel truly connected to the cause."
    },
    {
      name: "Michael Chen",
      role: "Volunteer Coordinator",
      image: "https://images.unsplash.com/photo-1754507128300-5d2023d3958c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU2NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      quote: "Working with HopeGive has been the most rewarding experience of my life. The organization's commitment to making a real difference is evident in everything they do."
    },
    {
      name: "Emily Rodriguez",
      role: "Community Partner",
      image: "https://images.unsplash.com/photo-1754507128300-5d2023d3958c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU2NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      quote: "The professionalism and dedication of the HopeGive team is unmatched. They've helped transform our community, and we couldn't be more grateful for their support."
    },
    {
      name: "David Williams",
      role: "Monthly Supporter",
      image: "https://images.unsplash.com/photo-1754507128300-5d2023d3958c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMHZvbHVudGVlciUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTU2NzcyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      quote: "I've supported many charities over the years, but HopeGive stands out. Their regular updates and transparency give me confidence that my money is being used effectively."
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#F1FAEE]">
      <div className="max-w-[1440px] mx-auto px-20">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 bg-white rounded-full mb-4">
            <span className="text-[#E63946]">Testimonials</span>
          </div>
          <h2 className="text-4xl lg:text-5xl text-[#1D3557] mb-4">
            What People Say About <span className="text-[#E63946]">Us</span>
          </h2>
          <p className="text-[#457B9D]">
            Hear from our donors, volunteers, and community partners about their 
            experiences with HopeGive.
          </p>
        </div>

        {/* Carousel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card className="bg-white border-none shadow-lg h-full">
                  <CardContent className="p-8 space-y-6">
                    {/* Quote Icon */}
                    <div className="w-12 h-12 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] rounded-full flex items-center justify-center">
                      <Quote className="w-6 h-6 text-white" />
                    </div>

                    {/* Quote */}
                    <p className="text-[#457B9D] italic leading-relaxed">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        <ImageWithFallback
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-[#1D3557]">{testimonial.name}</div>
                        <div className="text-sm text-[#457B9D]">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
    </section>
  );
}
