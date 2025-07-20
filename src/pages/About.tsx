import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Users, Award, Globe, Mail, Phone, MapPin } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Students", value: "25,000+", icon: Users },
    { label: "Faculty", value: "1,200+", icon: Award },
    { label: "Programs", value: "100+", icon: GraduationCap },
    { label: "Countries", value: "15+", icon: Globe },
  ];

  const features = [
    "Digital Leave Management System",
    "Real-time Leave Tracking",
    "Automated Approval Workflow",
    "Mobile-Responsive Interface",
    "Comprehensive Reporting",
    "Multi-level Authorization"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary rounded-xl">
              <GraduationCap className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            About Federal University Lafia
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A leading institution of higher learning committed to excellence in education, 
            research, and community service in Nigeria and beyond.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* About Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <GraduationCap className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To provide quality education, conduct cutting-edge research, and serve 
                the community through innovative programs that prepare students for 
                leadership roles in a globalized world.
              </p>
              <p className="text-muted-foreground">
                We are committed to fostering an environment of academic excellence, 
                integrity, and inclusivity that empowers our students to make meaningful 
                contributions to society.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                To be a world-class university recognized for excellence in teaching, 
                research, and innovation, producing graduates who are globally competitive 
                and socially responsible.
              </p>
              <p className="text-muted-foreground">
                We envision a future where our university serves as a beacon of knowledge 
                and a catalyst for sustainable development in Nigeria and Africa.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Leave Management System Features */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center">Leave Management System Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Badge variant="secondary" className="p-2">
                    <GraduationCap className="h-4 w-4" />
                  </Badge>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <MapPin className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Address</h3>
                <p className="text-sm text-muted-foreground">
                  Federal University Lafia<br />
                  PMB 146, Lafia<br />
                  Nasarawa State, Nigeria
                </p>
              </div>
              <div className="space-y-2">
                <Phone className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">
                  +234 (0) 47 220 001<br />
                  +234 (0) 47 220 002
                </p>
              </div>
              <div className="space-y-2">
                <Mail className="h-8 w-8 text-primary mx-auto" />
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">
                  info@fulafia.edu.ng<br />
                  registrar@fulafia.edu.ng
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default About;