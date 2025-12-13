import { Users, Heart, Globe, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export function CounterStats() {
  const stats = [
    {
      icon: Users,
      end: 150,
      label: "Students Educated",
      suffix: "+"
    },
    {
      icon: Heart,
      end: 2,
      label: "Research Centers",
      prefix: "",
      suffix: ""
    },
    {
      icon: Globe,
      end: 1,
      label: "Global School",
      suffix: ""
    },
    {
      icon: TrendingUp,
      end: 100,
      label: "Goal: Every Masjid",
      suffix: "%"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-r from-[#457B9D] to-[#1D3557] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-4 group"
            >
              <div className="w-16 h-16 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8 text-white" />
              </div>

              <div>
                <div className="text-4xl lg:text-5xl text-white mb-2">
                  <Counter
                    end={stat.end}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <div className="text-white/80">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({ end, prefix = "", suffix = "" }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [end]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  };

  return (
    <span>
      {prefix}
      {count >= 1000 ? formatNumber(count) : count}
      {suffix}
    </span>
  );
}
