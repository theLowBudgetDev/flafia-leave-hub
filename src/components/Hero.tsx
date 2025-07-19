import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Users, FileText } from "lucide-react";

export const Hero = () => {
  const features = [
    {
      icon: FileText,
      title: "Digital Applications",
      description: "Submit leave requests digitally, eliminating paperwork"
    },
    {
      icon: Clock,
      title: "Quick Approval",
      description: "Streamlined approval process with real-time status updates"
    },
    {
      icon: Users,
      title: "Multi-Role Support",
      description: "Supports staff, HR, and administrative roles"
    },
    {
      icon: CheckCircle,
      title: "Easy Tracking",
      description: "Track all your leave requests and history in one place"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Modern Leave Management
            <span className="block text-primary">for Federal University, Lafia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Transform your leave application process from traditional pen-and-paper methods 
            to a streamlined digital experience. Simplify requesting, approving, and tracking 
            leave applications for all university staff.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-8">
              Get Started
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8">
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-primary/5 to-accent/10 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to Digitize Your Leave Process?
          </h3>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join hundreds of university staff who have already made the switch to efficient, 
            paperless leave management.
          </p>
          <Button size="lg" className="text-base px-8">
            Start Your Application
          </Button>
        </div>
      </div>
    </section>
  );
};