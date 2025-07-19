import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LeaveStats } from "@/components/LeaveStats";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <LeaveStats />
      <Footer />
    </div>
  );
};

export default Index;
